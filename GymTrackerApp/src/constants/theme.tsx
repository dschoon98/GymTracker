import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName, Platform, TextStyle } from 'react-native';

export type ThemeColors = {
    background: string;

    surface: {
        level1: string;
        level2: string;
        level3: string;
        level4: string;
    };

    onSurface: {
        primary: string;
        secondary: string;
        disabled: string;
        inverse: string;
    };

    brand: {
        primary: string;
        secondary: string;
    };
    onBrand: {
        primary: string;
        secondary: string;
    };

    interactive: {
        primary: string;
        primaryHover: string;
        secondary: string;
        disabled: string;
    };

    onInteractive: {
        primary: string;
        secondary: string;
        disabled: string;
    };

    accent: {
        primary: string;   // Hot coral — PRs, highlights, streaks
        secondary: string; // Lime green — success, gains, progress
    };

    onAccent: {
        primary: string;
        secondary: string;
    };

    feedback: {
        error: string;
        onError: string;
        warning: string;
        onWarning: string;
        success: string;
        onSuccess: string;
        info: string;
        onInfo: string;
    };

    border: {
        subtle: string;
        default: string;
        strong: string;
        interactive: string;
    };

    shadow: string;
    overlay: string;

    // Gradient stop pairs for LinearGradient usage
    gradients: {
        primary: [string, string];   // Cyan → Blue CTA
        accent: [string, string];    // Coral → Pink achievement
        success: [string, string];   // Lime → Teal gains
        surface: [string, string];   // Subtle card shimmer
    };
};

// ═══════════════════════════════════════════
// ENERGETIC & VIVID  —  Nike Training vibe
// ═══════════════════════════════════════════

const lightColors: ThemeColors = {
    background: 'hsl(220, 20%, 100%)', // Cool off-white background

    surface: {
        level1: 'hsl(220, 18%, 100%)',   // Pure white cards
        level2: 'hsl(220, 16%, 98%)',    // Elevated cards
        level3: 'hsl(220, 14%, 95%)',
        level4: 'hsl(220, 12%, 92%)',
    },

    onSurface: {
        primary: 'hsl(230, 25%, 12%)',    // Near-black text
        secondary: 'hsl(230, 15%, 38%)',  // Gray text
        disabled: 'hsl(220, 10%, 62%)',
        inverse: 'hsl(220, 15%, 97%)',
    },

    brand: {
        primary: 'hsl(200, 90%, 42%)',    // Deep cyan-blue
        secondary: 'hsl(200, 70%, 52%)',
    },

    onBrand: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(220, 15%, 90%)',
    },

    interactive: {
        primary: 'hsl(200, 90%, 42%)',
        primaryHover: 'hsl(200, 90%, 35%)',
        secondary: 'hsl(220, 15%, 90%)',
        disabled: 'hsl(220, 10%, 85%)',
    },

    onInteractive: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(230, 25%, 15%)',
        disabled: 'hsl(220, 10%, 62%)',
    },

    accent: {
        primary: 'hsl(16, 90%, 52%)',     // Rich coral
        secondary: 'hsl(80, 70%, 38%)',   // Forest green
    },

    onAccent: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(0, 0%, 100%)',
    },

    feedback: {
        error: 'hsl(0, 78%, 55%)',
        onError: 'hsl(0, 0%, 100%)',
        warning: 'hsl(40, 92%, 50%)',
        onWarning: 'hsl(40, 90%, 10%)',
        success: 'hsl(150, 60%, 40%)',
        onSuccess: 'hsl(0, 0%, 100%)',
        info: 'hsl(200, 85%, 48%)',
        onInfo: 'hsl(0, 0%, 100%)',
    },

    border: {
        subtle: 'hsl(220, 15%, 92%)',
        default: 'hsl(220, 12%, 85%)',
        strong: 'hsl(220, 10%, 72%)',
        interactive: 'hsl(200, 90%, 42%)',
    },

    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.45)',

    gradients: {
        primary: ['hsl(195, 100%, 45%)', 'hsl(220, 90%, 50%)'],
        accent: ['hsl(16, 100%, 58%)', 'hsl(340, 85%, 55%)'],
        success: ['hsl(80, 75%, 45%)', 'hsl(170, 65%, 40%)'],
        surface: ['hsl(220, 18%, 100%)', 'hsl(220, 16%, 97%)'],
    },
};

const darkColors: ThemeColors = {
    background: 'hsl(230, 18%, 12%)', // Deep charcoal background
    surface: {
        level1: 'hsl(230, 18%, 12%)',    // Card surfaces
        level2: 'hsl(230, 16%, 16%)',    // Elevated cards
        level3: 'hsl(230, 14%, 20%)',
        level4: 'hsl(230, 12%, 26%)',
    },

    onSurface: {
        primary: 'hsl(220, 15%, 93%)',    // Near-white text
        secondary: 'hsl(220, 12%, 60%)',  // Muted blue-gray
        disabled: 'hsl(220, 10%, 40%)',
        inverse: 'hsl(230, 25%, 12%)',
    },

    brand: {
        primary: 'hsl(195, 100%, 50%)',   // Electric cyan
        secondary: 'hsl(195, 80%, 60%)',
    },

    onBrand: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(195, 90%, 8%)',
    },

    interactive: {
        primary: 'hsl(195, 100%, 50%)',
        primaryHover: 'hsl(195, 100%, 60%)',
        secondary: 'hsl(230, 16%, 22%)',
        disabled: 'hsl(230, 14%, 18%)',
    },

    onInteractive: {
        primary: 'hsl(230, 25%, 8%)',     // Dark text on bright cyan
        secondary: 'hsl(220, 15%, 88%)',
        disabled: 'hsl(220, 10%, 45%)',
    },

    accent: {
        primary: 'hsl(16, 100%, 62%)',    // Hot coral-orange
        secondary: 'hsl(80, 85%, 55%)',   // Vivid lime
    },

    onAccent: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: 'hsl(80, 90%, 8%)',
    },

    feedback: {
        error: 'hsl(0, 80%, 62%)',
        onError: 'hsl(0, 0%, 100%)',
        warning: 'hsl(40, 92%, 60%)',
        onWarning: 'hsl(40, 90%, 8%)',
        success: 'hsl(150, 65%, 50%)',
        onSuccess: 'hsl(150, 80%, 8%)',
        info: 'hsl(195, 90%, 55%)',
        onInfo: 'hsl(195, 90%, 8%)',
    },

    border: {
        subtle: 'hsl(230, 16%, 18%)',
        default: 'hsl(230, 14%, 26%)',
        strong: 'hsl(230, 12%, 38%)',
        interactive: 'hsl(195, 100%, 50%)',
    },

    shadow: 'rgba(0, 0, 0, 0.6)',
    overlay: 'rgba(0, 0, 0, 0.75)',

    gradients: {
        primary: ['hsl(195, 100%, 50%)', 'hsl(220, 85%, 55%)'],
        accent: ['hsl(16, 100%, 62%)', 'hsl(340, 80%, 58%)'],
        success: ['hsl(80, 85%, 55%)', 'hsl(170, 70%, 45%)'],
        surface: ['hsl(230, 18%, 12%)', 'hsl(230, 16%, 16%)'],
    },
};


export type ThemeMode = 'light' | 'dark' | 'system';

export type ThemeFonts = {
    regular: { fontFamily: string; fontWeight: TextStyle['fontWeight'] };
    medium: { fontFamily: string; fontWeight: TextStyle['fontWeight'] };
    bold: { fontFamily: string; fontWeight: TextStyle['fontWeight'] };
    labelLarge: { fontFamily: string; fontWeight: TextStyle['fontWeight']; fontSize: number };
};

export type ThemeHeaders = {
    h1: { fontSize: number; fontWeight: TextStyle['fontWeight']; color: string; opacity?: number };
    h2: { fontSize: number; fontWeight: TextStyle['fontWeight']; color: string; opacity?: number };
    h3: { fontSize: number; fontWeight: TextStyle['fontWeight']; color: string; lineHeight?: number; opacity?: number };
    h4: { fontSize: number; fontWeight: TextStyle['fontWeight']; color: string; lineHeight?: number; opacity?: number };
    h5: { fontSize: number; fontWeight: TextStyle['fontWeight']; color: string; lineHeight?: number; opacity?: number };
    h6: { fontSize: number; fontWeight: TextStyle['fontWeight']; color: string; lineHeight?: number; opacity?: number };
};

const baseFontFamily = 'Inter, System, Roboto, "Helvetica Neue", Arial, sans-serif';

const lightFonts: ThemeFonts = {
    regular: { fontFamily: baseFontFamily, fontWeight: '400' },
    medium: { fontFamily: baseFontFamily, fontWeight: '500' },
    bold: { fontFamily: baseFontFamily, fontWeight: '700' },
    labelLarge: { fontFamily: baseFontFamily, fontWeight: '500', fontSize: 15 },
};

const darkFonts: ThemeFonts = { ...lightFonts };

const scale = Platform.OS === 'ios' ? 0.92 : 1;
function scaleSize(size: number) {
    return Math.round(size * scale);
}

const lightHeaders: ThemeHeaders = {
    h1: { fontSize: scaleSize(28), fontWeight: '700', color: lightColors.onSurface.primary },
    h2: { fontSize: scaleSize(22), fontWeight: '600', color: lightColors.onSurface.primary, opacity: 0.92 },
    h3: { fontSize: scaleSize(17), fontWeight: '600', color: lightColors.onSurface.primary, opacity: 0.85 },
    h4: { fontSize: scaleSize(15), fontWeight: '500', color: lightColors.onSurface.primary, opacity: 0.78 },
    h5: { fontSize: scaleSize(13), fontWeight: '500', color: lightColors.onSurface.secondary },
    h6: { fontSize: scaleSize(11), fontWeight: '500', color: lightColors.onSurface.secondary },
};

const darkHeaders: ThemeHeaders = {
    h1: { fontSize: scaleSize(28), fontWeight: '700', color: darkColors.onSurface.primary },
    h2: { fontSize: scaleSize(22), fontWeight: '600', color: darkColors.onSurface.primary, opacity: 0.88 },
    h3: { fontSize: scaleSize(17), fontWeight: '600', color: darkColors.onSurface.primary, opacity: 0.72 },
    h4: { fontSize: scaleSize(15), fontWeight: '500', color: darkColors.onSurface.primary, opacity: 0.58 },
    h5: { fontSize: scaleSize(13), fontWeight: '500', color: darkColors.onSurface.secondary },
    h6: { fontSize: scaleSize(11), fontWeight: '500', color: darkColors.onSurface.secondary },
};

export type ThemeState = {
    bottomBarHeight: number;
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    systemColorScheme: ColorSchemeName;
    colors: ThemeColors;
    fonts: ThemeFonts;
    headers: ThemeHeaders;
    isDark: boolean;
};

function getFonts(mode: ThemeMode = 'system'): ThemeFonts {
    return mode === 'dark' ? darkFonts : lightFonts;
}

function getHeaders(mode: ThemeMode, systemColorScheme: ColorSchemeName): ThemeHeaders {
    const effective = mode === 'system' ? systemColorScheme : mode;
    return effective === 'dark' ? darkHeaders : lightHeaders;
}

function getColors(mode: ThemeMode, systemColorScheme: ColorSchemeName): ThemeColors {
    const effective = mode === 'system' ? systemColorScheme : mode;
    return effective === 'dark' ? darkColors : lightColors;
}

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setModeState] = useState<ThemeMode>('system');
    const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(
        Appearance.getColorScheme() || 'dark'
    );

    useEffect(() => {
        const sub = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemScheme(colorScheme);
        });
        return () => sub.remove();
    }, []);

    const setMode = useCallback((newMode: ThemeMode) => {
        setModeState(newMode);
        Appearance.setColorScheme((newMode === 'system' ? 'unspecified' : newMode) as ColorSchemeName);
    }, []);

    const value = useMemo<ThemeState>(() => {
        const effective = mode === 'system' ? systemScheme : mode;
        const isDark = effective === 'dark';

        return {
            bottomBarHeight: Platform.OS === 'ios' ? 60 : 80,
            mode,
            setMode,
            systemColorScheme: systemScheme,
            colors: getColors(mode, systemScheme),
            fonts: getFonts(mode),
            headers: getHeaders(mode, systemScheme),
            isDark,
        };
    }, [mode, systemScheme, setMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useAppTheme(): ThemeState;
export function useAppTheme<T>(selector: (state: ThemeState) => T): T;
export function useAppTheme<T>(selector?: (state: ThemeState) => T): ThemeState | T {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return selector ? selector(context) : context;
}