import { supabase } from './supabase';
import type {
  Profile,
  Prompt,
  Quiz,
  QuizAttempt,
  Discussion,
  DiscussionReply,
  Achievement,
  UserAchievement,
  UserProgress,
} from '@/types';

const normalizeUsername = (username: string) =>
  username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_') || 'user';

const isDuplicateUsernameError = (message: string) =>
  message.toLowerCase().includes('duplicate key') && message.toLowerCase().includes('username');

type LocalProgressMap = Record<string, string>;
type LocalQuizAttempt = {
  id: string;
  user_id: string;
  quiz_id: string;
  selected_option: string;
  is_correct: boolean;
  attempted_at: string;
};

const canUseLocalStorage = () => typeof window !== 'undefined' && !!window.localStorage;

const localProgressKey = (userId: string) => `ai_imaginarium_progress_${userId}`;
const localQuizAttemptsKey = (userId: string) => `ai_imaginarium_quiz_attempts_${userId}`;

const readLocalProgress = (userId: string): LocalProgressMap => {
  if (!canUseLocalStorage()) return {};
  try {
    const raw = window.localStorage.getItem(localProgressKey(userId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LocalProgressMap;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeLocalProgress = (userId: string, progressMap: LocalProgressMap): void => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(localProgressKey(userId), JSON.stringify(progressMap));
};

const markLocalModuleComplete = (userId: string, moduleName: string): void => {
  const existing = readLocalProgress(userId);
  existing[moduleName] = new Date().toISOString();
  writeLocalProgress(userId, existing);
};

const localProgressToRows = (userId: string): UserProgress[] => {
  const map = readLocalProgress(userId);
  return Object.entries(map).map(([moduleName, completedAt], index) => ({
    id: `local-progress-${userId}-${index}`,
    user_id: userId,
    module_name: moduleName,
    completed: true,
    completed_at: completedAt,
  }));
};

const readLocalQuizAttempts = (userId: string): LocalQuizAttempt[] => {
  if (!canUseLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(localQuizAttemptsKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalQuizAttempt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalQuizAttempts = (userId: string, attempts: LocalQuizAttempt[]): void => {
  if (!canUseLocalStorage()) return;
  window.localStorage.setItem(localQuizAttemptsKey(userId), JSON.stringify(attempts));
};

const addLocalQuizAttempt = (
  userId: string,
  quizId: string,
  selectedOption: string,
  isCorrect: boolean
): void => {
  const attempts = readLocalQuizAttempts(userId);
  attempts.unshift({
    id: `local-attempt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user_id: userId,
    quiz_id: quizId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    attempted_at: new Date().toISOString(),
  });
  writeLocalQuizAttempts(userId, attempts);
};

const mergeProgressRows = (remoteRows: UserProgress[], localRows: UserProgress[]): UserProgress[] => {
  const byModule = new Map<string, UserProgress>();
  for (const row of remoteRows) {
    byModule.set(row.module_name, row);
  }
  for (const row of localRows) {
    if (!byModule.has(row.module_name)) {
      byModule.set(row.module_name, row);
    }
  }
  return Array.from(byModule.values());
};

const ensureErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const value = (error as { message?: unknown }).message;
    if (typeof value === 'string' && value.trim()) return value;
  }
  return 'Unknown error';
};

const ensureUserProfileExists = async (userId: string): Promise<void> => {
  const { data: existingProfile, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existingProfile) return;

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;

  const currentUser = authData.user;
  if (!currentUser || currentUser.id !== userId) {
    throw new Error('Authenticated user mismatch while creating profile');
  }

  const usernameFromMetadata =
    typeof currentUser.user_metadata?.username === 'string'
      ? currentUser.user_metadata.username
      : '';
  const usernameFromEmail = currentUser.email?.split('@')[0] || '';
  const baseUsername = normalizeUsername(
    usernameFromMetadata || usernameFromEmail || `user_${userId.slice(0, 6)}`
  );
  const usernameCandidates = [baseUsername, `${baseUsername}_${userId.replace(/-/g, '').slice(0, 6)}`];

  let lastError: Error | null = null;

  for (const username of usernameCandidates) {
    const { error: insertError } = await supabase.from('profiles').insert({
      id: userId,
      username,
      email: currentUser.email ?? null,
    });

    if (!insertError) return;
    if (isDuplicateUsernameError(insertError.message)) continue;

    const lower = insertError.message.toLowerCase();
    if (lower.includes('row-level security')) {
      throw new Error(
        'Database policy blocked creating your profile. Run migration 00006_allow_users_to_create_own_profile.sql in Supabase.'
      );
    }

    lastError = insertError;
    break;
  }

  if (lastError) throw lastError;
  throw new Error('Failed to create profile with available username candidates');
};

// Profile APIs
export const getProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getAllProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const updateProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateUserRole = async (
  userId: string,
  role: 'user' | 'admin'
): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
};

// Prompt APIs
export const getAllPrompts = async (): Promise<Prompt[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .order('category', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getPromptsByCategory = async (category: string): Promise<Prompt[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('category', category)
    .order('difficulty', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getPromptsByDifficulty = async (
  difficulty: string
): Promise<Prompt[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('difficulty', difficulty)
    .order('category', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

// Quiz APIs
export const getQuizzesByModule = async (moduleLevel: string): Promise<Quiz[]> => {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('module_level', moduleLevel)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const submitQuizAttempt = async (
  userId: string,
  quizId: string,
  selectedOption: string,
  isCorrect: boolean
): Promise<void> => {
  let { error } = await supabase.from('quiz_attempts').insert({
    user_id: userId,
    quiz_id: quizId,
    selected_option: selectedOption,
    is_correct: isCorrect,
  });

  if (error) {
    const message = error.message.toLowerCase();
    const shouldRetryWithProfileRecovery =
      message.includes('violates foreign key constraint') ||
      message.includes('quiz_attempts_user_id_fkey');

    if (shouldRetryWithProfileRecovery) {
      await ensureUserProfileExists(userId);
      const retry = await supabase.from('quiz_attempts').insert({
        user_id: userId,
        quiz_id: quizId,
        selected_option: selectedOption,
        is_correct: isCorrect,
      });
      error = retry.error;
    }
  }

  if (error) {
    addLocalQuizAttempt(userId, quizId, selectedOption, isCorrect);
    console.warn('Using local fallback for quiz attempt:', ensureErrorMessage(error));
  }
};

export const getUserQuizAttempts = async (
  userId: string
): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false });

  const localAttempts = readLocalQuizAttempts(userId);
  if (error) return localAttempts;

  const remoteAttempts = Array.isArray(data) ? data : [];
  if (localAttempts.length === 0) return remoteAttempts;

  const byId = new Map<string, QuizAttempt>();
  for (const row of remoteAttempts) byId.set(row.id, row);
  for (const row of localAttempts) {
    if (!byId.has(row.id)) byId.set(row.id, row);
  }

  return Array.from(byId.values()).sort((a, b) =>
    new Date(b.attempted_at).getTime() - new Date(a.attempted_at).getTime()
  );
};

// Discussion APIs
export const getAllDiscussions = async (): Promise<Discussion[]> => {
  const { data, error } = await supabase
    .from('discussions')
    .select(`
      *,
      profiles!discussions_user_id_fkey(username)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return Array.isArray(data)
    ? data.map((d: any) => ({
        ...d,
        username: d.profiles?.username || 'Unknown',
      }))
    : [];
};

export const getDiscussionById = async (
  discussionId: string
): Promise<Discussion | null> => {
  const { data, error } = await supabase
    .from('discussions')
    .select(`
      *,
      profiles!discussions_user_id_fkey(username)
    `)
    .eq('id', discussionId)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  return {
    ...data,
    username: (data as any).profiles?.username || 'Unknown',
  };
};

export const createDiscussion = async (
  userId: string,
  title: string,
  content: string,
  category?: string
): Promise<Discussion | null> => {
  const { data, error } = await supabase
    .from('discussions')
    .insert({
      user_id: userId,
      title,
      content,
      category: category || null,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const updateDiscussion = async (
  discussionId: string,
  title: string,
  content: string
): Promise<void> => {
  const { error } = await supabase
    .from('discussions')
    .update({
      title,
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', discussionId);

  if (error) throw error;
};

export const deleteDiscussion = async (discussionId: string): Promise<void> => {
  const { error } = await supabase
    .from('discussions')
    .delete()
    .eq('id', discussionId);

  if (error) throw error;
};

// Discussion Reply APIs
export const getRepliesByDiscussion = async (
  discussionId: string
): Promise<DiscussionReply[]> => {
  const { data, error } = await supabase
    .from('discussion_replies')
    .select(`
      *,
      profiles!discussion_replies_user_id_fkey(username)
    `)
    .eq('discussion_id', discussionId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  return Array.isArray(data)
    ? data.map((r: any) => ({
        ...r,
        username: r.profiles?.username || 'Unknown',
      }))
    : [];
};

export const createReply = async (
  discussionId: string,
  userId: string,
  content: string
): Promise<DiscussionReply | null> => {
  const { data, error } = await supabase
    .from('discussion_replies')
    .insert({
      discussion_id: discussionId,
      user_id: userId,
      content,
    })
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const deleteReply = async (replyId: string): Promise<void> => {
  const { error } = await supabase
    .from('discussion_replies')
    .delete()
    .eq('id', replyId);

  if (error) throw error;
};

// Achievement APIs
export const getAllAchievements = async (): Promise<Achievement[]> => {
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('requirement_value', { ascending: true });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const getUserAchievements = async (
  userId: string
): Promise<UserAchievement[]> => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievements(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;

  return Array.isArray(data)
    ? data.map((ua: any) => ({
        ...ua,
        achievement: ua.achievements,
      }))
    : [];
};

export const awardAchievement = async (
  userId: string,
  achievementId: string
): Promise<void> => {
  const { error } = await supabase.from('user_achievements').insert({
    user_id: userId,
    achievement_id: achievementId,
  });

  if (error && !error.message.includes('duplicate')) throw error;
};

// User Progress APIs
export const getUserProgress = async (userId: string): Promise<UserProgress[]> => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  const localRows = localProgressToRows(userId);

  if (error) {
    return localRows;
  }

  const remoteRows = Array.isArray(data) ? data : [];
  return mergeProgressRows(remoteRows, localRows);
};

export const markModuleComplete = async (
  userId: string,
  moduleName: string
): Promise<void> => {
  let { error } = await supabase.from('user_progress').upsert(
    {
      user_id: userId,
      module_name: moduleName,
      completed: true,
      completed_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,module_name',
    }
  );

  if (error) {
    const message = error.message.toLowerCase();
    const shouldRetryWithProfileRecovery =
      message.includes('violates foreign key constraint') ||
      message.includes('user_progress_user_id_fkey');

    if (shouldRetryWithProfileRecovery) {
      await ensureUserProfileExists(userId);
      const retry = await supabase.from('user_progress').upsert(
        {
          user_id: userId,
          module_name: moduleName,
          completed: true,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,module_name',
        }
      );
      error = retry.error;
    }
  }

  if (error) {
    markLocalModuleComplete(userId, moduleName);
    console.warn('Using local fallback for module completion:', ensureErrorMessage(error));
  }
};

export const getModuleProgress = async (
  userId: string,
  moduleName: string
): Promise<UserProgress | null> => {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('module_name', moduleName)
    .maybeSingle();

  if (error) {
    const localMap = readLocalProgress(userId);
    const completedAt = localMap[moduleName];
    if (completedAt) {
      return {
        id: `local-progress-${userId}-${moduleName}`,
        user_id: userId,
        module_name: moduleName,
        completed: true,
        completed_at: completedAt,
      };
    }
    return null;
  }

  if (data) return data;

  const localMap = readLocalProgress(userId);
  const completedAt = localMap[moduleName];
  if (!completedAt) return null;

  return {
    id: `local-progress-${userId}-${moduleName}`,
    user_id: userId,
    module_name: moduleName,
    completed: true,
    completed_at: completedAt,
  };
};
