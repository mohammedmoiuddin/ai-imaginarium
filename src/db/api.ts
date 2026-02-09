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
  const { error } = await supabase.from('quiz_attempts').insert({
    user_id: userId,
    quiz_id: quizId,
    selected_option: selectedOption,
    is_correct: isCorrect,
  });

  if (error) throw error;
};

export const getUserQuizAttempts = async (
  userId: string
): Promise<QuizAttempt[]> => {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false });

  if (error) throw error;
  return Array.isArray(data) ? data : [];
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

  if (error) throw error;
  return Array.isArray(data) ? data : [];
};

export const markModuleComplete = async (
  userId: string,
  moduleName: string
): Promise<void> => {
  const { error } = await supabase.from('user_progress').upsert(
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

  if (error) throw error;
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

  if (error) throw error;
  return data;
};
