# Version 1: Standard Full Node Firmware

* **File**: `gridskip-v1.0-standard-factory.bin` (Size: ~2.1 MB)
* **Date**: September 6, 2026
* **Flashing Offset**: `0x0000` (All-in-one factory image)

---

### Features & Configuration:
* **Target Hardware**: ESP32 DevKit V1 + RA-02 SX1278 LoRa module + SH1106 / SSD1306 OLED display.
* **Firmware Base**: Full Meshtastic node firmware with baked-in GridSkip private mesh defaults.
* **Frequency**: `433.3125 MHz` (`EU_433` channel slot tuned for 433MHz SX1278).
* **Modem Preset**: `LONG_SLOW` (maximum link budget and sensitivity).
* **Encryption**: 128-bit AES private channel key (`Gskip_2026_priv\x01`).
* **Branding**: `GridSkip XXXX` BLE name and node title with custom "GS" boot logo.
* **Privacy**: NodeInfo auto-broadcast suppressed for 7 days; position broadcast off; MQTT routed to `127.0.0.1` (no public phone-home).

### Archive:
* The `partitions_archive/` subfolder contains the individual partition binaries (`bootloader.bin`, `partitions.bin`, `boot_app0.bin`, `firmware-gridskip-v1.bin`, `littlefs-gridskip-v1.bin`) for manual debugging.
