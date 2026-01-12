import { NextResponse } from 'next/server';
import { Container } from '@/infrastructure/di/Container';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    // Use Clean Architecture: Call use case through Container
    const getUserSettingsUseCase = Container.getUserSettingsUseCase();
    const result = await getUserSettingsUseCase.execute({ userId });

    if (result.isSuccess()) {
      return NextResponse.json({ success: true, settings: result.value });
    } else {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
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

    if (!settings.theme || !['light', 'dark'].includes(settings.theme)) {
      return NextResponse.json({ error: 'Invalid theme value' }, { status: 400 });
    }

    // Use Clean Architecture: Call use case through Container
    const updateUserSettingsUseCase = Container.updateUserSettingsUseCase();
    const result = await updateUserSettingsUseCase.execute({
      userId,
      theme: settings.theme,
    });

    if (result.isSuccess()) {
      return NextResponse.json({ success: true, settings: result.value });
    } else {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
