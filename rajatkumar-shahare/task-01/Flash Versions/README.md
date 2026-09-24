# GridSkip Firmware Versions Index

This directory archives all historical and current revisions of the GridSkip firmware binaries:

---

## 📂 Version Directory

| Version | Folder | Binary Name | Key Description |
| :--- | :--- | :--- | :--- |
| **V1.0** | [`v1_standard_full_node/`](./v1_standard_full_node/) | `gridskip-v1.0-standard-factory.bin` | Full Meshtastic node firmware with baked-in GridSkip private mesh defaults & EU_433 frequency. Includes partition archive. |
| **V2.0** | [`v2_exhibition_original_kiosk/`](./v2_exhibition_original_kiosk/) | `gridskip-v2.0-exhibition-kiosk-original.bin` | Original exhibition kiosk edition with Bongo Cat screensaver, live chat feed, and canned rotary composer. |
| **V3.0** | [`v3_exhibition_powerbank_keepalive/`](./v3_exhibition_powerbank_keepalive/) | `gridskip-v3.0-exhibition-powerbank-keepalive.bin` | Exhibition edition containing the FreeRTOS keep-alive compute pulse (~95-115mA spike every 6s) to prevent USB powerbanks from shutting off. |
| **V4.0** | [`v4_exhibition_clean_battery_edition/`](./v4_exhibition_clean_battery_edition/) | `gridskip-v4.0-exhibition-battery-clean.bin` | **Current Latest**: Powerbank keep-alive completely removed. Optimized for clean 5V LiPo battery operation with maximum battery runtime. |

---

## ⚡ Active Flashing

The root folder contains the active 1-click flashing scripts:
- `./flash_exhibition.sh` ➔ Flashes the latest Exhibition Edition (V4.0).
- `./flash_standard.sh` ➔ Flashes the Standard Mesh Node Edition (V1.0).
