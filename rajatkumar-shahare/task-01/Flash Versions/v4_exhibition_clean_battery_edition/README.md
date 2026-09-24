# Version 4: Exhibition Edition (Clean Battery Edition — Latest)

* **File**: `gridskip-v4.0-exhibition-battery-clean.bin`
* **Date**: September 24, 2026
* **Flashing Offset**: `0x0000` (All-in-one factory image)

---

### Features & Configuration:
* **Target Hardware**: ESP32 DevKit V1 + RA-02 SX1278 LoRa + Rotary Encoder + 2 Push Buttons + LiPo Battery / TP4056 / MT3608 (5.0V regulated).
* **Keep-Alive Removed**:
  * The `powerbankKeepAliveTask` and `xTaskCreatePinnedToCore(...)` call have been **completely eliminated**.
  * No artificial CPU/FPU current spikes or high-power bursts.
  * Maximum battery life and cool operation for prolonged battery-powered showcase.
* **UI Features**:
  * Screen 0: Bongo Cat screensaver.
  * Screen 1: Live chat message feed.
  * Screen 2: Quick preset rotary composer with `"GridSkip  |  BROADCAST"` clean header.
  * Full EU_433 MHz private mesh AES-128 encryption.
