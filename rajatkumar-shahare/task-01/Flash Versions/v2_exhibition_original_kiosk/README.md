# Version 2: Exhibition Original Kiosk Edition

* **File**: `gridskip-v2.0-exhibition-kiosk-original.bin` (Size: ~2.06 MB)
* **Date**: September 6, 2026
* **Flashing Offset**: `0x0000` (All-in-one factory image)

---

### Features & Configuration:
* **Target Hardware**: ESP32 DevKit V1 + RA-02 SX1278 + Rotary Encoder + 2 Push Buttons (GPIO 13 Back, GPIO 14 Send).
* **UI Modes**:
  * **Screen 0**: Bongo Cat screensaver and interactive mascot (paw animation while idle).
  * **Screen 1**: Live incoming chat message feed with clean fonts and "No messages" placeholder.
  * **Screen 2**: Interactive Rotary Composer Wheel with canned presets ("Hello from Station 1!", "Live Mesh Active", "Private and Off-Grid", "Zero Internet Required", "Message Received!").
* **Header Branding**: `"GRIDSKIP KIOSK"` on top status banner.
* **Keep-Alive**: None (standard idle power consumption).
