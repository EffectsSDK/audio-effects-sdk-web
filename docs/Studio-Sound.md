# Studio Sound Documentation

## Overview

Studio Sound is a professional-grade audio enhancement system that provides real-time voice processing with multiple filters and effects. It transforms your microphone audio into broadcast-quality sound suitable for podcasts, streaming, video conferencing, and professional communications.

The system includes equalization, dynamics processing, noise control, and automatic gain management - all optimized for real-time performance with minimal latency.

---

## Table of Contents

1. [Available Features](#available-features)
2. [Audio Filters](#audio-filters)
3. [EQ Presets](#eq-presets)
4. [Configuration Options](#configuration-options)
5. [How to Use](#how-to-use)
6. [Advanced Usage](#advanced-usage)
7. [Performance Considerations](#performance-considerations)

---

## Available Features

Studio Sound provides the following audio processing features:

- **Equalizer (EQ)** - Multi-band frequency shaping with professional presets
- **Compressor** - Dynamic range compression for consistent levels
- **Noise Gate** - Reduces background noise below a threshold
- **De-Esser** - Reduces harsh sibilance (s, sh sounds)
- **Auto Gain Control (AGC)** - Maintains consistent output levels
- **Brickwall Limiter** - Prevents clipping and distortion (always active)
- **Real-time Metrics** - Peak and RMS level monitoring

---

## Audio Filters

### 1. Equalizer (EQ)

**Purpose:** Shape the frequency response to enhance voice clarity, warmth, and presence.

**How it works:**
- Uses multiple biquad filters (IIR filters) for precise frequency control
- Each band can boost or cut specific frequency ranges
- Supports 7 filter types:
  - **lowpass**: Allows frequencies below cutoff, attenuates above
  - **highpass**: Allows frequencies above cutoff, attenuates below
  - **bandpass**: Allows frequencies in a band around center frequency
  - **lowshelf**: Boosts/cuts all frequencies below a certain point
  - **highshelf**: Boosts/cuts all frequencies above a certain point
  - **peaking**: Boosts/cuts a specific frequency band (most common for EQ)
  - **notch**: Heavily attenuates a narrow frequency band

**Configuration:**
```typescript
{
  preset: 'voice',           // Use built-in preset
  // OR
  customEQ: {               // Custom EQ configuration
    name: 'My Custom EQ',
    bands: [
      { frequency: 100, gain: -6, q: 0.7, type: 'highpass' },
      { frequency: 2000, gain: 2.5, q: 1.4, type: 'peaking' },
      { frequency: 8000, gain: 1.5, q: 0.7, type: 'highshelf' }
    ]
  }
}
```

**Parameters:**
- `frequency` (Hz): Center frequency of the filter
- `gain` (dB): Amount of boost (+) or cut (-). Range: -12 to +12 dB
- `q`: Filter bandwidth (0.5 = wide, 2.0 = narrow)
- `type`: Filter shape (see filter types above)

**Use Cases:**
- Remove low-frequency rumble with highpass filter (80-100 Hz)
- Boost presence and clarity (2-5 kHz range)
- Add air and sparkle (8-10 kHz range)
- Reduce muddiness (150-300 Hz)

---

### 2. Compressor

**Purpose:** Reduce dynamic range by making loud sounds quieter and optionally boosting quiet sounds, resulting in more consistent audio levels.

**How it works:**
- Monitors audio level continuously
- When signal exceeds threshold, reduces gain based on ratio
- Uses soft knee for smooth, transparent compression
- Automatically applies makeup gain to maintain perceived loudness

**Configuration:**
```typescript
{
  enableCompressorEQ: true,
  compressorThreshold: -12,    // dBFS
  compressorRatio: 4           // Compression ratio
}
```

**Parameters:**
- `compressorThreshold` (dBFS): Level above which compression starts. Range: -30 to 0 dB
  - `-12 dB`: Moderate compression (default)
  - `-20 dB`: Gentle compression
  - `-6 dB`: Aggressive compression

- `compressorRatio`: Amount of gain reduction. Range: 1 to 10
  - `2:1`: Gentle compression
  - `4:1`: Moderate compression (default)
  - `8:1`: Heavy compression
  - `10:1`: Near-limiting

**Technical Details:**
- Attack time: 3ms (fast response)
- Release time: 120ms (smooth recovery)
- Knee: Hard knee by default (softKnee = 0 dB)
  - Can be configured with soft knee for smoother compression
- Auto makeup gain: Disabled by default
  - When enabled, applies up to 6 dB makeup gain based on ratio
- LUT-based dB conversion for performance (2048-entry table, -80 to +10 dB range)

**Use Cases:**
- Even out volume differences when speaking at varying distances from mic
- Make whispers more audible without making loud speech too loud
- Create professional, broadcast-ready dynamics

---

### 3. Noise Gate

**Purpose:** Reduce background noise by lowering the volume when audio falls below a threshold.

**How it works:**
- Monitors audio envelope (RMS level)
- When audio drops below threshold, applies gain reduction
- Uses hysteresis to prevent "chattering" on/off
- Soft knee for smooth transitions

**Configuration:**
```typescript
{
  enableNoiseGate: true,
  gateThreshold: -55,      // dBFS
  gateReduction: -20       // dB of reduction
}
```

**Parameters:**
- `gateThreshold` (dBFS): Level below which gate activates. Range: -80 to 0 dB
  - **Practical range: -35 to -25 dB** (measured using RMS/envelope, not peaks)
  - `-35 dB`: Gentle gating, keeps some room tone
  - `-30 dB`: Moderate gating (good for most cases)
  - `-25 dB`: Aggressive gating, only opens for clear speech
  - Note: Default is -55 dB but this is too low for most real-world usage

- `gateReduction` (dB): Amount of attenuation when gate is closed. Range: -60 to 0 dB
  - `-10 dB`: Subtle noise reduction
  - `-20 dB`: Moderate reduction (default)
  - `-40 dB`: Heavy reduction

**Technical Details:**
- Envelope follower: 1ms attack, 200ms release (measures average level, not peaks)
- Hysteresis: ±3 dB prevents gate chattering on/off
- Soft knee ratio: 1.8 for natural sound
- Gain smoothing: 5ms down, 120ms up (prevents clicks)
- **Important**: Threshold is compared to RMS envelope, not peak levels
  - Speech RMS is typically -30 to -20 dBFS during talking
  - Background noise RMS is typically -50 to -35 dBFS
  - This is why practical thresholds are -35 to -25 dB

**Use Cases:**
- Reduce fan noise, keyboard typing, or room tone between speech
- Clean up pauses in podcasts or presentations
- Reduce background noise in untreated rooms

---

### 4. De-Esser

**Purpose:** Reduce harsh, sibilant sounds (s, sh, ch sounds) that can be piercing or cause distortion.

**How it works:**
- Splits audio into high and low frequency bands
- Detects sibilance at 6500 Hz
- Compresses only the sibilant frequencies when detected
- Uses lookahead for precise processing

**Configuration:**
```typescript
{
  enableDeEsser: true
}
```

**Technical Details:**
- Detection frequency: 6500 Hz (bandpass filter, Q=1.4)
- Split frequency: 3800 Hz (separates low/high bands)
- Threshold: -20 dBFS
- Ratio: 4:1
- Soft knee: 3 dB for smooth transitions
- Maximum reduction: 8 dB
- Attack time: 1ms (fast response)
- Release time: 60ms (smooth recovery)
- Hysteresis: ±2 dB prevents rapid on/off switching
- Optional lookahead: 0ms by default (disabled)

**Use Cases:**
- Reduce harsh "ess" sounds in vocals
- Control high-frequency microphone brightness
- Prevent sibilance distortion in broadcast
- Essential for close-mic'd recordings

**How It Works - Technical Deep Dive:**
1. Full signal is split into low band (below 3800 Hz) and high band (above 3800 Hz)
2. A bandpass filter at 6500 Hz detects sibilant energy
3. When sibilance exceeds -20 dBFS, compression is applied ONLY to the high band
4. Low band passes through unaffected, preserving voice body
5. Hysteresis prevents the de-esser from rapidly turning on/off

**Note:** De-esser settings are optimized for voice and typically don't require adjustment. It operates automatically when enabled.

---

### 5. Auto Gain Control (AGC)

**Purpose:** Automatically maintain consistent output levels regardless of input volume variations.

**How it works:**
- Continuously monitors audio RMS level
- Calculates required gain to reach target level
- Applies smooth gain adjustments
- Updates gain every 64 samples (~1.3ms @ 48kHz) for performance

**Configuration:**
```typescript
{
  enableAutoGain: true,
  autoGainTargetDb: -12      // Target output level
}
```

**Parameters:**
- `autoGainTargetDb` (dBFS): Desired output level. Range: -30 to 0 dB
  - `-18 dB`: Quieter, more headroom
  - `-12 dB`: Moderate level (default)
  - `-6 dB`: Louder output

**Use Cases:**
- Compensate for varying microphone distances
- Maintain consistent levels when multiple people speak
- Normalize output for streaming/recording
- Automatically adjust for quiet or loud talkers

**Important Notes:**
- AGC works in conjunction with the brickwall limiter
- Lower target dB values provide more headroom and safety
- May amplify background noise if set too aggressively
- Gain range is limited: 0.1x to 10.0x (prevents extreme amplification)
- Uses RMS level with 300ms smoothing for stable gain calculation

---

### 6. Brickwall Limiter

**Purpose:** Prevent digital clipping by enforcing a hard ceiling on audio peaks.

**How it works:**
- Always active (cannot be disabled)
- Uses 5ms lookahead buffer
- Applies instant attenuation when peaks would exceed threshold
- Fast attack prevents any samples from clipping

**Technical Details:**
- Threshold: 0.98 linear (approximately -0.17 dBFS)
- Lookahead: 5ms (prevents clipping before it occurs)
- Attack: Instantaneous (no attack time)
- Release: 10ms (smooth gain recovery)
- Uses ring buffer for lookahead processing
- Gain envelope tracking prevents pumping artifacts

**Note:** This filter is automatically applied as the final stage of all audio processing and requires no configuration.

---

## EQ Presets

Studio Sound includes 5 professionally-tuned EQ presets optimized for different voice characteristics and use cases:

### 1. Professional Voice (voice)
**Best for:** General-purpose voice enhancement, video calls, streaming

Focuses on clarity and intelligibility with emphasis on presence frequencies.

- **80 Hz Highpass (-8 dB)**: Removes low-frequency rumble
- **150 Hz Peaking (-2 dB)**: Reduces muddiness
- **1000 Hz Peaking (+1.5 dB)**: Enhances fundamental clarity
- **2500 Hz Peaking (+2 dB)**: Boosts presence and intelligibility
- **5000 Hz Peaking (+1.5 dB)**: Adds articulation
- **8000 Hz Highshelf (+2 dB)**: Increases air and sparkle

---

### 2. Podcast Enhancement (podcast)
**Best for:** Podcast recording, long-form content, audiobook narration

Optimized for extended listening with balanced warmth and clarity.

- **60 Hz Highpass (-10 dB)**: Aggressive rumble removal
- **120 Hz Peaking (-2 dB)**: Reduces boominess
- **500 Hz Peaking (+0.8 dB)**: Adds body
- **1500 Hz Peaking (+1.8 dB)**: Enhances speech clarity
- **3500 Hz Peaking (+2 dB)**: Improves articulation
- **7000 Hz Peaking (+1.2 dB)**: Adds detail
- **9500 Hz Highshelf (+0.8 dB)**: Subtle air enhancement

---

### 3. Broadcast Radio (broadcast)
**Best for:** Radio-style sound, announcements, professional broadcasting

Creates authoritative, clear sound suitable for radio and broadcasting.

- **90 Hz Highpass (-12 dB)**: Heavy low-frequency filtering
- **200 Hz Peaking (-1 dB)**: Tightens low-mids
- **800 Hz Peaking (+1.2 dB)**: Enhances clarity
- **2200 Hz Peaking (+2.5 dB)**: Strong presence boost
- **4000 Hz Peaking (+2 dB)**: Enhances consonants
- **6500 Hz Peaking (+1.2 dB)**: Adds definition
- **9500 Hz Highshelf (+0.8 dB)**: Adds air

---

### 4. Warm Enhancement (warm)
**Best for:** Deep voices, adding warmth to thin voices, intimate sound

Emphasizes low-mids and reduces highs for a warmer, fuller tone.

- **70 Hz Highpass (-6 dB)**: Gentle rumble removal
- **200 Hz Lowshelf (+1.5 dB)**: Adds warmth and body
- **800 Hz Peaking (+0.8 dB)**: Enhances fullness
- **2000 Hz Peaking (+1.2 dB)**: Maintains clarity
- **5000 Hz Peaking (+0.3 dB)**: Subtle presence
- **8000 Hz Highshelf (-0.5 dB)**: Reduces harshness

---

### 5. Bright & Clear (bright)
**Best for:** High clarity, cutting through noise, energetic sound

Emphasizes high frequencies for maximum clarity and presence.

- **90 Hz Highpass (-8 dB)**: Removes low-frequency noise
- **300 Hz Peaking (-0.5 dB)**: Reduces muddiness
- **1200 Hz Peaking (+1 dB)**: Enhances clarity
- **2800 Hz Peaking (+2.2 dB)**: Strong presence boost
- **5200 Hz Peaking (+1.5 dB)**: Adds brilliance
- **9500 Hz Highshelf (+1.2 dB)**: Maximum air and detail

---

## Configuration Options

### Complete Configuration Interface

```typescript
interface StudioAudioOptions {
  enabled?: boolean;                  // Enable/disable all studio audio
  options?: EnhancementOptions;
}

interface EnhancementOptions {
  // EQ Configuration
  preset?: string;                    // 'voice' | 'podcast' | 'broadcast' | 'warm' | 'bright'
  customEQ?: EQPreset;               // Custom EQ configuration (overrides preset)

  // Compressor Configuration
  enableCompressorEQ?: boolean;      // Enable dynamics compression
  compressorThreshold?: number;      // dBFS, default: -12, range: -30 to 0
  compressorRatio?: number;          // default: 4, range: 1 to 10

  // Noise Gate Configuration
  enableNoiseGate?: boolean;         // Enable noise gate
  gateThreshold?: number;            // dBFS, default: -55, range: -80 to 0
  gateReduction?: number;            // dB, default: -20, range: -60 to 0

  // De-Esser Configuration
  enableDeEsser?: boolean;           // Enable sibilance reduction

  // Auto Gain Control Configuration
  enableAutoGain?: boolean;          // Enable auto gain control
  autoGainTargetDb?: number;         // dBFS, default: -12, range: -30 to 0

  // Output Configuration
  outputGain?: number;               // Linear multiplier, default: 1.0
}

interface EQPreset {
  name: string;
  bands: Array<{
    frequency: number;               // Hz
    gain: number;                    // dB, range: -12 to +12
    q: number;                       // Filter bandwidth, typical: 0.5 to 2.0
    type: 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch';
  }>;
}
```

### Default Settings

```typescript
{
  enabled: false,
  options: {
    preset: 'voice',
    enableCompressorEQ: true,
    compressorThreshold: -12,
    compressorRatio: 4,
    enableNoiseGate: true,
    gateThreshold: -55,        // NOTE: Too low for practical use, use -30 to -25 dB
    gateReduction: -20,
    enableDeEsser: true,
    enableAutoGain: false,
    autoGainTargetDb: -12,
    outputGain: 1.0
  }
}
```

---

## How to Use

### Basic Setup

**IMPORTANT: Studio Sound options should be set inside the `sdk.onReady` callback to ensure the audio worklet is initialized.**

```typescript
// Initialize SDK
const sdk = new window.atsvb('{CUSTOMER_ID}');

// Configure SDK
sdk.config({
  preset: 'balanced',
  sample_rate: 48000
});

// Set up the onReady callback BEFORE calling sdk.useStream()
sdk.onReady = () => {
  console.log('SDK is ready');

  // Now it's safe to configure Studio Sound
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      preset: 'voice',
      enableCompressorEQ: true,
      enableDeEsser: true
    }
  });

  // Or use quick enable/disable methods
  sdk.enableStudioSound();   // Turn on with current settings
  sdk.disableStudioSound();  // Turn off
};

// Initialize with audio stream
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
sdk.useStream(stream);  // This will trigger onReady when initialization completes
```

**Why wait for `onReady`?**
- The audio worklet must be initialized before Studio Sound can process audio
- Calling `setStudioSoundOptions()` before `onReady` will silently fail (no error, but no effect)
- `onReady` is called once the SDK has initialized all audio processing components

### Common Configurations

#### 1. Podcast Recording Setup

```typescript
sdk.onReady = () => {
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      preset: 'podcast',
      enableCompressorEQ: true,
      compressorThreshold: -14,
      compressorRatio: 3,
      enableNoiseGate: true,
      gateThreshold: -30,        // RMS-based: -30 dB is moderate
      gateReduction: -25,
      enableDeEsser: true,
      enableAutoGain: true,
      autoGainTargetDb: -12
    }
  });
};
```

#### 2. Live Streaming Setup

```typescript
sdk.onReady = () => {
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      preset: 'broadcast',
      enableCompressorEQ: true,
      compressorThreshold: -10,
      compressorRatio: 6,
      enableNoiseGate: true,
      gateThreshold: -28,        // RMS-based: -28 dB for clean streaming
      gateReduction: -20,
      enableDeEsser: true,
      enableAutoGain: true,
      autoGainTargetDb: -9
    }
  });
};
```

#### 3. Video Conferencing Setup

```typescript
sdk.onReady = () => {
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      preset: 'voice',
      enableCompressorEQ: true,
      compressorThreshold: -12,
      compressorRatio: 4,
      enableNoiseGate: true,
      gateThreshold: -32,        // RMS-based: -32 dB for gentle gating
      gateReduction: -15,
      enableDeEsser: true,
      enableAutoGain: false  // May cause issues with some conferencing software
    }
  });
};
```

#### 4. Minimal Processing (Clean Audio)

```typescript
sdk.onReady = () => {
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      preset: 'voice',
      enableCompressorEQ: false,
      enableNoiseGate: false,
      enableDeEsser: true,
      enableAutoGain: false
    }
  });
};
```

### Monitoring Audio Levels

```typescript
// Set up metrics callback (can be done before onReady)
sdk.onStudioAudioMetrics((metrics) => {
  console.log('Peak Level:', metrics.peakDb.toFixed(1), 'dB');
  console.log('RMS Level:', metrics.rmsDb.toFixed(1), 'dB');
  console.log('Peak (linear):', metrics.peak.toFixed(3));
  console.log('RMS (linear):', metrics.rms.toFixed(3));
});

// Note: Metrics are only emitted when Studio Sound is enabled
```

**Metrics Explanation:**
- `peak`: Maximum absolute sample value (0.0 to 1.0)
  - Uses peak decay (0.9999 per sample) for natural meter falloff
- `rms`: Root Mean Square (average) level (0.0 to 1.0)
  - Calculated using exponential moving average with 300ms time constant
- `peakDb`: Peak level in decibels (typically -60 to 0 dB)
- `rmsDb`: RMS level in decibels (typically -60 to 0 dB)
  - Calculated directly from power (10*log10) to avoid sqrt operation

**Guidelines:**
- Target peak levels: -6 to -3 dB (safe headroom)
- Target RMS levels: -18 to -12 dB (comfortable listening)
- Avoid sustained peaks above -1 dB

---

## Advanced Usage

### Custom EQ Configuration

Create your own EQ curve by specifying individual filter bands:

```typescript
sdk.onReady = () => {
  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      customEQ: {
        name: 'My Custom Voice EQ',
        bands: [
          // Remove rumble
          { frequency: 80, gain: -10, q: 0.707, type: 'highpass' },

          // Reduce muddiness
          { frequency: 250, gain: -3, q: 1.2, type: 'peaking' },

          // Enhance clarity
          { frequency: 1500, gain: 2, q: 1.5, type: 'peaking' },

          // Boost presence
          { frequency: 3500, gain: 3, q: 1.4, type: 'peaking' },

          // Add air
          { frequency: 10000, gain: 1.5, q: 0.8, type: 'highshelf' }
        ]
      },
      enableCompressorEQ: true,
      enableDeEsser: true
    }
  });
};
```

### Dynamic Settings Updates

You can update settings in real-time without reinitializing (after SDK is ready):

```typescript
let isSDKReady = false;

sdk.onReady = () => {
  isSDKReady = true;
  // Initial setup
  sdk.setStudioSoundOptions({
    enabled: true,
    options: { preset: 'voice' }
  });
};

// Later, update specific parameters (e.g., from UI controls)
function updateCompressor(threshold, ratio) {
  if (!isSDKReady) {
    console.warn('SDK not ready yet');
    return;
  }

  sdk.setStudioSoundOptions({
    enabled: true,
    options: {
      compressorThreshold: threshold,
      compressorRatio: ratio
    }
  });

  // Changes take effect immediately on the next audio buffer
}

// Example: User adjusts slider
document.getElementById('threshold-slider').addEventListener('input', (e) => {
  if (isSDKReady) {
    updateCompressor(parseInt(e.target.value), 4);
  }
});
```

### Processing Pipeline Order

Understanding the processing order helps optimize your settings:

```
Input Audio
    ↓
[Noise Cancelling Model] (if enabled separately)
    ↓
━━━━━ Studio Audio Processing ━━━━━
    ↓
[Noise Gate] (if enabled)
    ↓
[De-Esser] (if enabled)
    ↓
[EQ Filters] (if preset or customEQ configured)
    ↓
[Compressor] (if enabled)
    ↓
[Auto Gain Control] (if enabled)
    ↓
[Output Gain] (always applied)
    ↓
[Brickwall Limiter] (always active)
    ↓
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    ↓
[Metrics Calculation]
    ↓
Output Audio
```

### Performance Optimization Tips

1. **Disable Unused Features**: Only enable the filters you need
2. **EQ Band Count**: Fewer EQ bands = better performance
3. **Buffer Size**: Larger buffers improve efficiency (configured at SDK level)
4. **AGC Update Rate**: Fixed at 64 samples (~1.3ms @ 48kHz) for optimal performance
5. **Denormal Handling**: Automatically optimized
   - Biquad filters check every 128 samples for denormals
   - Buffer processing flushes denormals once at end
   - Threshold: 1e-20 (prevents CPU slowdown from denormal numbers)
6. **EQ Processing**: Uses buffer mode with 4x loop unrolling for ~2-3x speedup
7. **Compressor LUT**: 2048-entry lookup table for fast dB-to-linear conversion

---

## Performance Considerations

### CPU Usage

The audio processing system is highly optimized for real-time performance:

- **EQ Filters**: Use buffer-based processing with 4x loop unrolling
- **AGC**: Updates every 64 samples (~1.3ms @ 48kHz) instead of per-sample
- **Compressor**: Uses LUT (Look-Up Table) for fast dB conversions
- **Denormal Handling**: Periodic checking (every 16 samples) prevents CPU spikes
- **Fast Path**: If all processing is disabled, only limiter is applied

**Typical CPU Usage** (on modern hardware):
- Minimal (Limiter only): ~0.5% CPU
- Light (EQ + De-esser): ~1-2% CPU
- Full Processing (All features): ~3-5% CPU

### Latency

- **Processing Latency**: ~128 samples (2.67ms @ 48kHz)
- **Lookahead Latency**: +5ms for limiter lookahead
- **Total Latency**: Typically 5-10ms depending on buffer size

### Sample Rate Support

Studio Sound supports all standard sample rates:
- 16 kHz (minimum, reduced quality)
- 32 kHz (good performance/quality balance)
- 48 kHz (recommended, professional quality)
- Sample rate is configured at SDK level via `sdk.config({ sample_rate: 48000 })`

### Browser Compatibility

Studio Sound uses:
- **AudioWorklet** (preferred): Chrome 66+, Firefox 76+, Safari 14.1+
- **ScriptProcessor** (fallback): All modern browsers
- **Automatic detection**: SDK chooses best available method

---

## Troubleshooting

### Common Issues

**1. No audio output**
- Ensure `sdk.enableStudioSound()` is called
- Check that `enabled: true` in `setStudioSoundOptions()`
- Verify microphone permissions granted

**2. Audio too quiet**
- Enable Auto Gain Control
- Increase `autoGainTargetDb` (e.g., from -12 to -9)
- Check `outputGain` is set to 1.0 or higher
- Reduce compressor ratio

**3. Audio too loud / distorted**
- Reduce `autoGainTargetDb` (e.g., from -9 to -15)
- Lower compressor ratio
- Decrease EQ gain values
- Check input gain at OS/hardware level

**4. Too much noise gating (cutting off speech)**
- Increase `gateThreshold` (make it less negative, e.g., -30 to -25)
- Reduce `gateReduction` (e.g., -20 to -10)
- Remember: Gate uses RMS/envelope detection, not peak levels
- Disable noise gate if in very quiet environment

**5. Background noise too prominent**
- Lower `gateThreshold` (more negative, e.g., -28 to -35)
- Increase `gateReduction` (e.g., -15 to -30)
- Consider using noise cancelling in addition to Studio Sound
- Be cautious with AGC, which can amplify noise
- Note: Going below -40 dB threshold rarely helps due to RMS detection

**6. Harsh or sibilant "s" sounds**
- Ensure `enableDeEsser: true`
- De-esser parameters are pre-tuned and don't require adjustment
- If still harsh, reduce high-frequency EQ boost (5-10 kHz range)

**7. Muffled or dark sound**
- Switch to 'bright' preset
- Increase high-shelf gain (8-10 kHz range)
- Reduce low-mid EQ cuts (200-500 Hz)

**8. Thin or lacking body**
- Switch to 'warm' preset
- Boost low-shelf (150-250 Hz range)
- Reduce excessive highpass filtering

---

## Best Practices

1. **Start with a Preset**: Choose the preset closest to your use case, then adjust
2. **Enable Features Gradually**: Add one feature at a time to understand its effect
3. **Monitor Levels**: Use the metrics callback to ensure proper levels
4. **Adjust in Order**: EQ → Compression → Gate → AGC
5. **Less is More**: Don't over-process; subtle adjustments often sound better
6. **Test with Real Content**: Always test with actual speech, not silence or noise
7. **Consider Your Environment**: Quiet room = less aggressive gating; noisy room = more
8. **Match Your Use Case**: Podcast settings differ from live streaming settings

---

## Additional Resources

- **Demo**: See `/demo/studio_sound.html` for interactive examples
- **Source Code**: `/src/utils/enhancer/` for implementation details
- **Main SDK**: `/src/atsvb.ts` for public API methods

---

## Summary

Studio Sound transforms raw microphone audio into professional, broadcast-quality sound through intelligent processing:

- **5 EQ Presets** for different voice types and use cases
- **Custom EQ** support for precise frequency shaping
- **Dynamics Processing** for consistent levels and professional sound
- **Noise Control** to reduce unwanted background sounds
- **Auto Gain** for hands-free level management
- **Real-time Metrics** for monitoring and quality control

All processing is optimized for real-time performance with minimal CPU usage and latency, making it suitable for live applications like streaming, video calls, and podcasting.
