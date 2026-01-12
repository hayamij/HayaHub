import { NextResponse } from 'next/server';

interface UserSettings {
  theme?: 'light' | 'dark';
  [key: string]: unknown;
}

// Simple in-memory storage for now (will be replaced with actual GitHub API storage)
// Key: userId, Value: settings object
const settingsStore = new Map<string, UserSettings>();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const settings = settingsStore.get(userId) || { theme: 'light' };
    
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('Failed to get settings:', error);
    return NextResponse.json({ error: 'Failed to get settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, settings } = body;

    if (!userId || !settings) {
      return NextResponse.json({ error: 'userId and settings are required' }, { status: 400 });
    }

    // Merge with existing settings
    const existingSettings = settingsStore.get(userId) || {};
    const updatedSettings = { ...existingSettings, ...settings };
    
    settingsStore.set(userId, updatedSettings);

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
