# Version 3: Exhibition Edition (Powerbank Keep-Alive Patch)

* **File**: `gridskip-v3.0-exhibition-powerbank-keepalive.bin` (Size: ~2.04 MB)
* **Date**: September 9, 2026
* **Flashing Offset**: `0x0000` (All-in-one factory image)

---

### Features & Configuration:
* **Background Context**: Created when testing with an external USB powerbank that kept auto-shutting off after a few seconds due to the ESP32's low idle current draw (<40mA).
* **Powerbank Keep-Alive Task (`pb_keepalive`)**:
  * Added a dedicated FreeRTOS task running on Core 0.
  * Every 6.0 seconds, it turned on the onboard blue LED (GPIO 2) and saturated the Xtensa 240MHz CPU/FPU pipeline for 250 milliseconds.
  * This spiked current draw to ~95–115 mA, tricking the powerbank into staying on.
* **Header Branding**: Cleaned up the composer header text from `"GRIDSKIP KIOSK"` to `"GridSkip"`.
* **Note**: When running on a LiPo battery with TP4056 and MT3608 boost converter, this artificial compute spike wastes battery power and is unnecessary.
