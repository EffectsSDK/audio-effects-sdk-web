export declare enum WORKER_PROCESSOR_POSTMESSAGE_TYPE {
    PROCESSOR_READY = "processor_ready",
    WORKLET_PORT = "worklet_port",
    DENOISE_POWER = "denoise_power",
    DENOISE_STAGES = "denoise_stages",
    ERROR = "error",
    ERROR_BUS = "error_bus",
    INIT = "init",
    CLEAN = "clean",
    DBG_DELAY_PROCESSING = "delay_processing",
    AUTH_REQUEST = "auth_request",
    AUTH_RESPONSE = "auth_response"
}
export declare enum WORKLET_PROCESSOR_POSTMESSAGE_TYPE {
    STUDIO_SOUND_OPTIONS = "studio_sound_options",
    STUDIO_AUDIO_METRICS = "studio_audio_metrics",
    START_PROCESSING = "start_processing",
    STOP_PROCESSING = "stop_processing",
    PROCESSING_CHUNK = "processing_chunk",
    WORKER_PORT = "worker_port",
    PERFORMANCE_STOP = "performance_stop",
    SPEEDUP_VOICE = "speedup_voice",
    MODEL_SAMPLE_RATE = "model_sample_rate",
    ERROR = "error",
    INFO = "info",
    DBG_PUSH_SILENCE = "push_silence",
    DBG_FREEZE_OUTPUT = "dbg_freeze_output",
    DBG_ENABLE_STATS = "dbg_enable_stats",
    DBG_STATS = "dbg_stats",
    LATENCY = "latency"
}
