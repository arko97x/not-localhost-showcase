// Disc definitions and canvas texture generators for 15 retro DVDs/CDs
import * as THREE from 'three';

export const DISCS = [
  {
    id: 1,
    title: "The Matrix",
    year: "1999",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "136 min",
    aspect: "2.35:1 Widescreen",
    audio: "Dolby Digital 5.1",
    tagline: "Welcome to the Real World.",
    synopsis: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    quote: "\"You take the blue pill, the story ends. You take the red pill, you stay in Wonderland, and I show you how deep the rabbit hole goes.\"",
    chapters: ["1. The Logos Encounter", "2. The White Rabbit", "3. Down the Rabbit Hole", "4. Dojo Sparring", "5. Lobby Shootout", "6. Roof Chopper", "7. Subway Showdown"],
    easterEgg: "Bullet-time multi-camera rig test reel accessible via secret menu code [UP, UP, DOWN, ENTER].",
    themeColor: "#00ff66",
    bgColor: "#040d05",
    accentColor: "#003b14",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;
      
      // Background gradient
      const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, width * 0.48);
      grad.addColorStop(0, '#001a08');
      grad.addColorStop(0.7, '#020b04');
      grad.addColorStop(1, '#000000');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Matrix digital rain glyphs
      ctx.fillStyle = '#00ff66';
      ctx.font = '16px monospace';
      ctx.textAlign = 'center';
      for (let x = 60; x < width - 60; x += 28) {
        const len = 8 + Math.floor(Math.random() * 18);
        for (let y = 0; y < len; y++) {
          const py = 80 + y * 24;
          const dist = Math.hypot(x - cx, py - cy);
          if (dist > 150 && dist < width * 0.46) {
            const alpha = Math.max(0.1, 1 - y / len);
            ctx.fillStyle = `rgba(0, ${Math.floor(200 + Math.random() * 55)}, 90, ${alpha * 0.65})`;
            const char = String.fromCharCode(0x30a0 + Math.floor(Math.random() * 80));
            ctx.fillText(char, x, py);
          }
        }
      }

      // Title & Logos
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00ff66';
      ctx.shadowBlur = 18;
      ctx.font = 'bold 54px serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('THE MATRIX', cx, cy - 190);
      
      ctx.shadowBlur = 0;
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#00ff66';
      ctx.fillText('SPECIAL EDITION • TWO-DISC SET', cx, cy - 150);

      // Warner Bros Shield & Badges
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 160, cy + 220, 320, 50);
      ctx.fillStyle = '#b3ffc6';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('DOLBY DIGITAL 5.1 • WIDESCREEN • REGION 1', cx, cy + 252);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#00bb44';
      ctx.fillText('WARNER BROS. PICTURES  •  VILLAGE ROADSHOW', cx, cy + 320);
      ctx.fillText('© 1999 WARNER HOME VIDEO. ALL RIGHTS RESERVED.', cx, cy + 345);
      ctx.restore();
    }
  },

  {
    id: 2,
    title: "Shrek 2",
    year: "2004",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "93 min",
    aspect: "1.85:1 Anamorphic",
    audio: "Dolby Digital 5.1 Surround EX",
    tagline: "The whole family is back in Far Far Away!",
    synopsis: "Shrek and Fiona travel to the Kingdom of Far Far Away, where Fiona's parents are King and Queen, to celebrate their marriage.",
    quote: "\"Are we there yet? No. Are we there yet? No. Are we there yet? No! Are we there yet? YES! Really? NO!\"",
    chapters: ["1. Honeymoon Bliss", "2. Far Far Away Royal Summons", "3. Dinner with the In-Laws", "4. Fairy Godmother's Cottage", "5. Puss in Boots Ambush", "6. I Need a Hero Siege", "7. Far Far Away Idol"],
    easterEgg: "Far Far Away Idol interactive voting game hosted by Simon Cowell (Simon Cadell)!",
    themeColor: "#8cc63f",
    bgColor: "#234015",
    accentColor: "#f39c12",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Swamp Green Gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#5b8e22');
      grad.addColorStop(0.6, '#315712');
      grad.addColorStop(1, '#1b3209');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Bubbles & slime particles
      ctx.fillStyle = 'rgba(164, 218, 59, 0.2)';
      for (let i = 0; i < 40; i++) {
        const bx = 100 + Math.random() * (width - 200);
        const by = 100 + Math.random() * (height - 200);
        const r = 5 + Math.random() * 25;
        if (Math.hypot(bx - cx, by - cy) > 150) {
          ctx.beginPath();
          ctx.arc(bx, by, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      // Ogre Ears decorative silhouette above title
      ctx.fillStyle = '#8cc63f';
      ctx.beginPath();
      ctx.ellipse(cx - 90, cy - 230, 25, 12, -0.4, 0, Math.PI * 2);
      ctx.ellipse(cx + 90, cy - 230, 25, 12, 0.4, 0, Math.PI * 2);
      ctx.fill();

      // Big "SHREK 2" Logo
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#2b510c';
      ctx.lineWidth = 14;
      ctx.font = '900 80px "Arial Black", impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('SHREK 2', cx, cy - 170);
      ctx.fillText('SHREK 2', cx, cy - 170);

      // Gold badge "SPECIAL EDITION"
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('FAR FAR AWAY SPECIAL EDITION', cx, cy - 125);

      // Bonus feature badge
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.roundRect(cx - 200, cy + 190, 400, 44, 22);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('⭐ INCLUDES "FAR FAR AWAY IDOL" SING-ALONG ⭐', cx, cy + 218);

      // DreamWorks logo & legal
      ctx.fillStyle = '#e2f0d9';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('DREAMWORKS HOME ENTERTAINMENT', cx, cy + 280);
      ctx.font = '13px sans-serif';
      ctx.fillText('RATED PG FOR CRUDE HUMOR, SOME CRUDE SWAMP ACTIONS', cx, cy + 310);
      ctx.fillText('© 2004 DREAMWORKS ANIMATION L.L.C.', cx, cy + 335);
      ctx.restore();
    }
  },

  {
    id: 3,
    title: "Lord of the Rings: Fellowship of the Ring",
    year: "2001",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "208 min (Extended)",
    aspect: "2.35:1 Anamorphic",
    audio: "DTS-ES 6.1 / Dolby 5.1 EX",
    tagline: "The Fate of Middle-earth Begins Here.",
    synopsis: "A meek Hobbit of the Shire and eight companions set out on a journey to mount Doom to destroy the powerful One Ring and save Middle-earth.",
    quote: "\"One Ring to rule them all, One Ring to find them, One Ring to bring them all, and in the darkness bind them.\"",
    chapters: ["1. Concerning Hobbits", "2. A Long-expected Party", "3. Keep It Secret, Keep It Safe", "4. At the Sign of The Prancing Pony", "5. Flight to the Ford", "6. The Council of Elrond", "7. The Mines of Moria", "8. The Bridge of Khazad-dûm", "9. The Breaking of the Fellowship"],
    easterEgg: "Hidden MTV Movie Awards parody scene starring Sarah Michelle Gellar and Jack Black!",
    themeColor: "#e5a93b",
    bgColor: "#1c140a",
    accentColor: "#935116",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Ancient Parchment / Leather radial gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#382510');
      grad.addColorStop(0.5, '#221508');
      grad.addColorStop(1, '#110b04');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Golden Elvish Ring surrounding inner hub
      ctx.save();
      ctx.strokeStyle = '#e5a93b';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#f39c12';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(cx, cy, 180, 0, Math.PI * 2);
      ctx.stroke();

      // Inner elvish script runes ring
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffcf77';
      ctx.font = 'italic 16px serif';
      ctx.textAlign = 'center';
      for (let i = 0; i < 16; i++) {
        const ang = (i / 16) * Math.PI * 2;
        const rx = cx + Math.cos(ang) * 195;
        const ry = cy + Math.sin(ang) * 195;
        ctx.fillText('~ ash nazg durbatulûk ~', rx, ry);
      }

      // Title
      ctx.fillStyle = '#fce2a6';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10;
      ctx.font = 'bold 36px "Times New Roman", serif';
      ctx.fillText('THE LORD OF THE RINGS', cx, cy - 210);

      ctx.font = 'italic 28px serif';
      ctx.fillStyle = '#e5a93b';
      ctx.fillText('The Fellowship of the Ring', cx, cy - 170);

      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('SPECIAL EXTENDED DVD EDITION • DISC 1', cx, cy - 130);

      // DTS ES & New Line Cinema
      ctx.fillStyle = '#fce2a6';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('DTS-ES 6.1 SURROUND SOUND • THX', cx, cy + 240);

      ctx.font = '14px serif';
      ctx.fillStyle = '#ba9562';
      ctx.fillText('NEW LINE CINEMA • WIDESCREEN COLLECTION', cx, cy + 300);
      ctx.fillText('© 2001 NEW LINE PRODUCTIONS, INC.', cx, cy + 325);
      ctx.restore();
    }
  },

  {
    id: 4,
    title: "Spirited Away",
    year: "2001",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "125 min",
    aspect: "2.0:1 Widescreen",
    audio: "Japanese / English Dolby 5.1",
    tagline: "Beyond imagination. Beyond memory. Beyond the spirit world.",
    synopsis: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts.",
    quote: "\"Once you've met someone you never really forget them. It just takes a while for your memories to come back.\"",
    chapters: ["1. The Abandoned Park", "2. Twilight at the Bathhouse", "3. Kamaji the Boiler Man", "4. Contract with Yubaba", "5. The Stink Spirit", "6. No-Face Goes Wild", "7. The Sixth Station Train", "8. Remembering Haku's Name"],
    easterEgg: "Studio Ghibli storyboards side-by-side multi-angle viewing feature!",
    themeColor: "#48dbfb",
    bgColor: "#091f36",
    accentColor: "#ff6b6b",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Midnight blue starry gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#10375c');
      grad.addColorStop(0.7, '#0b1d3a');
      grad.addColorStop(1, '#050c18');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gentle cloud silhouettes and stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 60; i++) {
        const sx = 80 + Math.random() * (width - 160);
        const sy = 80 + Math.random() * (height - 160);
        if (Math.hypot(sx - cx, sy - cy) > 160) {
          ctx.beginPath();
          ctx.arc(sx, sy, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.save();
      // Japanese Original Title Kanji
      ctx.textAlign = 'center';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = 'bold 38px serif';
      ctx.fillText('千と千尋の神隠し', cx, cy - 250);

      // Main English Title
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#48dbfb';
      ctx.shadowBlur = 12;
      ctx.font = 'bold 52px serif';
      ctx.fillText('SPIRITED AWAY', cx, cy - 195);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ff9f43';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('A FILM BY HAYAO MIYAZAKI', cx, cy - 150);

      // Academy Award Seal
      ctx.strokeStyle = '#feca57';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy + 220, 50, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#feca57';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('ACADEMY AWARD', cx, cy + 215);
      ctx.fillText('WINNER', cx, cy + 230);
      ctx.fillText('BEST ANIMATED FEATURE', cx, cy + 245);

      // Studio Ghibli logo text
      ctx.fillStyle = '#c8d6e5';
      ctx.font = '14px sans-serif';
      ctx.fillText('STUDIO GHIBLI • WALT DISNEY HOME ENTERTAINMENT', cx, cy + 320);
      ctx.restore();
    }
  },

  {
    id: 5,
    title: "Grand Theft Auto: Vice City",
    year: "2002",
    format: "PLAYSTATION 2 DVD-ROM",
    region: "NTSC U/C",
    runtime: "Interactive",
    aspect: "4:3 / 16:9",
    audio: "Dolby Surround Pro Logic II",
    tagline: "Sun, palms, synth, and crime.",
    synopsis: "Welcome to Vice City. Welcome to the 1980s. From the decade of big hair, excess and pastel suits comes a story of one man's rise to the top of the criminal pile.",
    quote: "\"Tommy Vercetti... Huh! Shit. Didn't think they'd ever let him out.\"",
    chapters: ["1. The Party at Cortez's Yacht", "2. Avery Carrington Demolition", "3. Diaz Mansions", "4. Rub Out", "5. Malibu Club Heist", "6. Keep Your Friends Close"],
    easterEgg: "Enter weapons cheat: R1, R2, L1, R2, LEFT, DOWN, RIGHT, UP, LEFT, DOWN, RIGHT, UP!",
    themeColor: "#ff007f",
    bgColor: "#1a0026",
    accentColor: "#00f0ff",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Neon 80s dusk gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#2d004b');
      grad.addColorStop(0.5, '#6a0979');
      grad.addColorStop(1, '#ff007f');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Neon grid lines on bottom
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      for (let y = cy + 100; y < height - 60; y += 22) {
        ctx.beginPath();
        ctx.moveTo(60, y);
        ctx.lineTo(width - 60, y);
        ctx.stroke();
      }

      ctx.save();
      // PS2 Header
      ctx.fillStyle = '#000000';
      ctx.fillRect(cx - 240, 70, 480, 50);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PlayStation 2', cx, 105);

      // Palm trees silhouette in center background
      ctx.fillStyle = '#110022';
      ctx.beginPath();
      ctx.moveTo(cx - 180, cy - 20);
      ctx.bezierCurveTo(cx - 160, cy - 140, cx - 140, cy - 170, cx - 130, cy - 190);
      ctx.stroke();

      // Vice City cursive logo
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10;
      ctx.font = 'italic bold 70px "Brush Script MT", cursive, sans-serif';
      ctx.fillText('vice city', cx, cy - 110);

      ctx.font = 'bold 24px "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.fillText('grand theft auto', cx, cy - 170);

      // Parental Advisory / M rating badge
      ctx.fillStyle = '#000000';
      ctx.fillRect(cx - 220, cy + 180, 80, 100);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(cx - 220, cy + 180, 80, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px sans-serif';
      ctx.fillText('M', cx - 180, cy + 245);
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('MATURE 17+', cx - 180, cy + 268);

      // Rockstar Logo
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(cx + 140, cy + 200, 70, 70);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('R', cx + 172, cy + 252);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('SLUS-20552 • NTSC U/C • DVD-ROM', cx, cy + 340);
      ctx.restore();
    }
  },

  {
    id: 6,
    title: "Summer Mix '03 (CD-R)",
    year: "2003",
    format: "CD-R 700MB / 80 MIN",
    region: "Personal Audio Mix",
    runtime: "73 min",
    aspect: "N/A",
    audio: "Stereo 44.1kHz 16-bit",
    tagline: "Burned at 8x speed on Nero Burning ROM.",
    synopsis: "The quintessential early-2000s burned CD-R with handwriting in blue and black Sharpie. Contains essential skate punk, emo, and nu-metal anthems.",
    quote: "\"DO NOT SCRATCH!! Keep in case or I swear I'm not burning you another copy.\"",
    chapters: ["1. Sum 41 - In Too Deep", "2. Blink-182 - What's My Age Again", "3. Linkin Park - Numb", "4. Jimmy Eat World - The Middle", "5. The All-American Rejects - Swing, Swing", "6. Fountains of Wayne - Stacy's Mom", "7. Outkast - Hey Ya!"],
    easterEgg: "Secret uncredited bonus track at minute 11:24 of track 7 (an awkward voicemail from high school).",
    themeColor: "#00d2d3",
    bgColor: "#0d2b38",
    accentColor: "#ff6b6b",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Classic Cyan/Silver blank CD-R dye surface
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#53a8b6');
      grad.addColorStop(0.3, '#79c2d0');
      grad.addColorStop(0.7, '#5585b5');
      grad.addColorStop(1, '#3b6978');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Verbatim / Memorex top brand printed bar
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(80, cy - 250, width - 160, 35);
      ctx.fillStyle = '#0f3044';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('CD-R 80  •  700MB  •  52x MULTI-SPEED COMPATIBLE', 100, cy - 225);

      // Authentic black Sharpie handwriting!
      ctx.fillStyle = '#111116';
      ctx.font = 'bold 46px "Comic Sans MS", "Caveat", cursive, sans-serif';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(cx, cy - 150);
      ctx.rotate(-0.06);
      ctx.fillText('SUMMER \'03 MIX 🎸🔥', 0, 0);
      ctx.restore();

      // Sharpie tracklist
      ctx.textAlign = 'left';
      ctx.font = '22px "Comic Sans MS", "Caveat", cursive, sans-serif';
      const tracks = [
        "1. In Too Deep - Sum 41",
        "2. What's My Age Again - Blink",
        "3. Numb - Linkin Park",
        "4. The Middle - Jimmy Eat World",
        "5. Stacy's Mom (hilarious)",
        "6. Hey Ya! - Outkast"
      ];
      tracks.forEach((t, idx) => {
        ctx.fillText(t, cx - 210, cy + 140 + idx * 30);
      });

      // Sharpie doodle at bottom
      ctx.font = 'italic 18px cursive';
      ctx.fillStyle = '#c0392b';
      ctx.fillText('~ FOR CAR ROAD TRIPS ONLY ~', cx - 120, cy + 335);
      ctx.restore();
    }
  },

  {
    id: 7,
    title: "Jurassic Park",
    year: "1993",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "127 min",
    aspect: "1.85:1 Anamorphic",
    audio: "DTS 5.1 / Dolby Digital 5.1",
    tagline: "An adventure 65 million years in the making.",
    synopsis: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
    quote: "\"Life, uh... finds a way.\"",
    chapters: ["1. Raptor Transfer", "2. Welcome to Jurassic Park", "3. Hatching the Raptor", "4. The T-Rex Paddock", "5. Tree Rescue", "6. Kitchen Stealth", "7. When Dinosaurs Ruled the Earth"],
    easterEgg: "Dennis Nedry's computer terminal simulator: 'YOU DIDN'T SAY THE MAGIC WORD!'",
    themeColor: "#ff3838",
    bgColor: "#1a0b0b",
    accentColor: "#ff9f1a",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Dark moody charcoal base
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#222222');
      grad.addColorStop(0.7, '#141414');
      grad.addColorStop(1, '#050505');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      // Jurassic Park Circular Seal
      ctx.beginPath();
      ctx.arc(cx, cy - 140, 120, 0, Math.PI * 2);
      ctx.fillStyle = '#ff3838'; // Blood red
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.strokeStyle = '#f1c40f'; // Electric warning yellow
      ctx.stroke();

      // T-Rex Silhouette (simplified iconic low-poly profile)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(cx - 20, cy - 150, 60, 45, 0.2, 0, Math.PI * 2);
      ctx.fill();
      // Open Jaws
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy - 170);
      ctx.lineTo(cx + 30, cy - 190);
      ctx.lineTo(cx - 10, cy - 150);
      ctx.lineTo(cx + 40, cy - 130);
      ctx.lineTo(cx - 70, cy - 120);
      ctx.closePath();
      ctx.fill();

      // Title Text
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;
      ctx.font = '900 46px "Impact", "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('JURASSIC PARK', cx, cy - 120);
      ctx.fillText('JURASSIC PARK', cx, cy - 120);

      // DTS Seal
      ctx.fillStyle = '#f1c40f';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('DIGITAL dts SURROUND SOUND', cx, cy + 200);

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('UNIVERSAL STUDIOS COLLECTOR\'S EDITION', cx, cy + 245);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#888888';
      ctx.fillText('© 1993 AMBLIN ENTERTAINMENT, INC. & UNIVERSAL STUDIOS.', cx, cy + 320);
      ctx.restore();
    }
  },

  {
    id: 8,
    title: "Spider-Man 2",
    year: "2004",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "127 min",
    aspect: "2.40:1 Widescreen",
    audio: "Dolby Digital 5.1",
    tagline: "Sacrifice. Choice. Destiny.",
    synopsis: "Peter Parker is beset with all manner of problems in his personal life, while battling the brilliant scientist Doctor Otto Octavius.",
    quote: "\"With great power comes great responsibility... and sometimes you just deliver pizzas on time.\"",
    chapters: ["1. Pizza Time Deliveries", "2. The Fusion Demonstration", "3. Birth of Doc Ock", "4. Raindrops Keep Fallin' on My Head", "5. Bank Vault Clash", "6. Clock Tower & Train Fight", "7. In the River"],
    easterEgg: "Sam Raimi blooper reel featuring Alfred Molina singing 'If I Were a Rich Man' with his mechanical tentacles!",
    themeColor: "#e84118",
    bgColor: "#192a56",
    accentColor: "#00a8ff",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Deep Red suit fabric gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#c23616');
      grad.addColorStop(0.6, '#9c1c04');
      grad.addColorStop(1, '#480808');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Webbing lines
      ctx.strokeStyle = 'rgba(230, 230, 230, 0.4)';
      ctx.lineWidth = 2.5;
      for (let r = 120; r < 450; r += 55) {
        ctx.beginPath();
        ctx.arc(cx, cy - 140, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (let a = 0; a < 16; a++) {
        const ang = (a / 16) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 140);
        ctx.lineTo(cx + Math.cos(ang) * 450, cy - 140 + Math.sin(ang) * 450);
        ctx.stroke();
      }

      ctx.save();
      // Spider Emblem in center
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 180, 18, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 15;
      ctx.font = 'bold 56px "Trebuchet MS", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SPIDER-MAN 2', cx, cy - 90);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fbc531';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SPECIAL TWO-DISC WIDESCREEN EDITION', cx, cy - 50);

      // Columbia Pictures Logo
      ctx.fillStyle = '#f5f6fa';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('COLUMBIA PICTURES  •  MARVEL ENTERPRISES', cx, cy + 240);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#dcdde1';
      ctx.fillText('RATED PG-13 FOR STYLIZED ACTION VIOLENCE', cx, cy + 280);
      ctx.fillText('© 2004 COLUMBIA PICTURES INDUSTRIES, INC.', cx, cy + 305);
      ctx.restore();
    }
  },

  {
    id: 9,
    title: "Final Fantasy VII - Disc 1",
    year: "1997",
    format: "PLAYSTATION CD-ROM",
    region: "NTSC U/C",
    runtime: "Interactive RPG",
    aspect: "4:3 Standard",
    audio: "Stereo Redbook Audio",
    tagline: "The story that defined an entire generation.",
    synopsis: "A mercenary with an oversized Buster Sword joins an eco-terrorist group to battle an evil megacorporation draining the planet's lifeblood.",
    quote: "\"What took you so long, Cloud? An ex-SOLDIER like you shouldn't have trouble with a couple of Shinra grunts.\"",
    chapters: ["1. Mako Reactor 1 Bombing", "2. 7th Heaven Bar & Tifa", "3. Aerith's Church in the Slums", "4. Wall Market Infiltration", "5. Shinra Headquarters Assault", "6. Escape from Midgar", "7. Kalm Flashback"],
    easterEgg: "Look at the black underside of the disc: the legendary dark polycarbonate PlayStation CD coating!",
    themeColor: "#00d2d3",
    bgColor: "#0f171e",
    accentColor: "#10ac84",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Pure sleek silver-white disc face with Squaresoft minimalism
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#f1f2f6');
      grad.addColorStop(0.7, '#ced6e0');
      grad.addColorStop(1, '#a4b0be');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      // Green Mako Meteor Logo
      ctx.fillStyle = '#10ac84';
      ctx.shadowColor = '#1dd1a1';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 170, 40, 0, Math.PI * 2);
      ctx.fill();
      // Meteor tail
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 210);
      ctx.quadraticCurveTo(cx + 80, cy - 240, cx + 130, cy - 150);
      ctx.quadraticCurveTo(cx + 40, cy - 130, cx - 10, cy - 135);
      ctx.fill();

      // Title
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#2f3542';
      ctx.font = 'bold 44px "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FINAL FANTASY VII', cx, cy - 70);

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#57606f';
      ctx.fillText('DISC 1 OF 3', cx, cy - 30);

      // PlayStation Classic Logo
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('PlayStation', cx, cy + 220);

      ctx.fillStyle = '#ff4757';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('SQUARESOFT', cx, cy + 265);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#747d8c';
      ctx.fillText('SCUS-94163 • COMPACT DISC • NTSC U/C', cx, cy + 320);
      ctx.restore();
    }
  },

  {
    id: 10,
    title: "Windows 98 Second Edition",
    year: "1999",
    format: "BOOTABLE CD-ROM",
    region: "OEM Setup & Recovery",
    runtime: "OS Installation",
    aspect: "VGA / SVGA 1024x768",
    audio: "Microsoft Sound.wav",
    tagline: "Where do you want to go today?",
    synopsis: "The landmark operating system release with enhanced USB support, Internet Explorer 5.0, and DirectX 6.1.",
    quote: "\"Please insert Disk 23 or click OK to cancel... Just kidding, it's all on this shiny CD-ROM now!\"",
    chapters: ["1. Format C: Drive", "2. ScanDisk File System Check", "3. Copying Windows Files...", "4. Detecting Hardware (Plug and Play)", "5. Welcome to Windows 98 SE", "6. Connecting via Dial-Up Modem 56K"],
    easterEgg: "CD-KEY: VP27J-F4C9Y-G8JHH-7634F-7V94T (The most memorized serial number of the 90s).",
    themeColor: "#008080",
    bgColor: "#052222",
    accentColor: "#ffbb00",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Holographic foil pattern background
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#dcdde1');
      grad.addColorStop(0.3, '#718093');
      grad.addColorStop(0.6, '#008080');
      grad.addColorStop(1, '#004a4a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Hologram anti-piracy ring
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 230, 100, 0.4)';
      ctx.lineWidth = 18;
      ctx.beginPath();
      ctx.arc(cx, cy, 210, 0, Math.PI * 2);
      ctx.stroke();

      // Microsoft 4-Color Windows Flag
      const flagX = cx - 40;
      const flagY = cy - 220;
      const size = 35;
      ctx.fillStyle = '#e84118'; ctx.fillRect(flagX, flagY, size, size); // Red
      ctx.fillStyle = '#4cd137'; ctx.fillRect(flagX + 42, flagY, size, size); // Green
      ctx.fillStyle = '#00a8ff'; ctx.fillRect(flagX, flagY + 42, size, size); // Blue
      ctx.fillStyle = '#fbc531'; ctx.fillRect(flagX + 42, flagY + 42, size, size); // Yellow

      // Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px "Franklin Gothic Medium", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Microsoft® Windows® 98', cx, cy - 110);

      ctx.fillStyle = '#fbc531';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('Second Edition', cx, cy - 70);

      // Warning text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('For distribution only with a new PC.', cx, cy + 220);
      ctx.fillText('Do not make illegal copies of this disc.', cx, cy + 245);

      ctx.font = '13px monospace';
      ctx.fillStyle = '#dcdde1';
      ctx.fillText('Product Key on Certificate of Authenticity (COA)', cx, cy + 300);
      ctx.fillText('Part No. X04-89732 • CD Set No. 1', cx, cy + 325);
      ctx.restore();
    }
  },

  {
    id: 11,
    title: "Tony Hawk's Pro Skater 3",
    year: "2001",
    format: "DVD-ROM / PS2",
    region: "NTSC",
    runtime: "Interactive",
    aspect: "4:3 Fullscreen",
    audio: "Stereo Punk / Hip-Hop",
    tagline: "Drop in. Revert. Combo into infinity.",
    synopsis: "Introduced the revolutionary Revert mechanic, forever cementing million-point skate combos into history.",
    quote: "\"So here I am, doing everything I can, holding on to what I am, pretending I'm a superman!\"",
    chapters: ["1. Foundry Heat", "2. Canada Timber Mill", "3. Rio de Janeiro", "4. Suburbia Haunted House", "5. Airport Metal Detectors", "6. Skater Island", "7. Los Angeles Earthquake", "8. Tokyo Neon Lights"],
    easterEgg: "Unlock Darth Maul and Wolverine skaters by completing career mode with 100% stats!",
    themeColor: "#ff793f",
    bgColor: "#2c2c54",
    accentColor: "#ffb142",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Dark grip tape texture
      ctx.fillStyle = '#1e1e24';
      ctx.fillRect(0, 0, width, height);

      // Grip tape specks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 300; i++) {
        const gx = 60 + Math.random() * (width - 120);
        const gy = 60 + Math.random() * (height - 120);
        if (Math.hypot(gx - cx, gy - cy) > 150) {
          ctx.fillRect(gx, gy, 2, 2);
        }
      }

      ctx.save();
      // Skate scratch marks
      ctx.strokeStyle = '#ff793f';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(cx - 200, cy - 220);
      ctx.lineTo(cx + 200, cy - 130);
      ctx.stroke();

      // Bold Stencil Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 48px "Impact", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TONY HAWK\'S', cx, cy - 170);

      ctx.fillStyle = '#ff793f';
      ctx.font = '900 68px "Impact", sans-serif';
      ctx.fillText('PRO SKATER 3', cx, cy - 105);

      // Neversoft Eyeball / Activision O2
      ctx.fillStyle = '#ffb142';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('ACTIVISION O2  •  NEVERSOFT', cx, cy + 220);

      ctx.fillStyle = '#ffffff';
      ctx.font = '14px sans-serif';
      ctx.fillText('FEATURING SONGS BY RAMONES, AFI, CKY, REDMAN', cx, cy + 280);
      ctx.fillText('© 2001 ACTIVISION PUBLISHING, INC.', cx, cy + 310);
      ctx.restore();
    }
  },

  {
    id: 12,
    title: "Linkin Park - Hybrid Theory",
    year: "2000",
    format: "ENHANCED CD-AUDIO",
    region: "Worldwide",
    runtime: "37 min 45 sec",
    aspect: "N/A",
    audio: "Stereo 44.1kHz / 16-bit",
    tagline: "The definitive soundtrack of the nu-metal era.",
    synopsis: "The best-selling debut album of the 21st century, combining aggressive rock riffs, hip-hop beats, and Chester Bennington's iconic vocals.",
    quote: "\"I tried so hard and got so far, but in the end, it doesn't even matter.\"",
    chapters: ["1. Papercut", "2. One Step Closer", "3. With You", "4. Points of Authority", "5. Crawling", "6. Runaway", "7. By Myself", "8. In the End", "9. A Place for My Head", "10. Forgotten", "11. Cure for the Itch", "12. Pushing Me Away"],
    easterEgg: "Insert disc into a PC CD-ROM drive to launch the QuickTime secret street-art desktop screensaver!",
    themeColor: "#ff4757",
    bgColor: "#2d3436",
    accentColor: "#ffa502",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Grunge beige/cardboard texture
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#dcdde1');
      grad.addColorStop(0.6, '#b2bec3');
      grad.addColorStop(1, '#636e72');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Red paint splatters
      ctx.fillStyle = 'rgba(235, 77, 75, 0.4)';
      for (let i = 0; i < 20; i++) {
        const px = cx + (Math.random() - 0.5) * 360;
        const py = cy + (Math.random() - 0.5) * 360;
        ctx.beginPath();
        ctx.arc(px, py, 3 + Math.random() * 12, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      // Soldier with Dragonfly Wings silhouette
      ctx.fillStyle = '#2d3436';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 160, 20, 35, 0, 0, Math.PI * 2);
      ctx.fill();
      // Wings
      ctx.strokeStyle = '#2d3436';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 160);
      ctx.bezierCurveTo(cx - 80, cy - 220, cx - 120, cy - 130, cx, cy - 150);
      ctx.moveTo(cx, cy - 160);
      ctx.bezierCurveTo(cx + 80, cy - 220, cx + 120, cy - 130, cx, cy - 150);
      ctx.stroke();

      // Title
      ctx.fillStyle = '#d63031';
      ctx.font = '900 42px "Arial Black", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('LINKIN PARK', cx, cy - 90);

      ctx.fillStyle = '#2d3436';
      ctx.font = 'bold 26px sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('HYBRID THEORY', cx, cy - 50);

      // Warner Bros Records
      ctx.fillStyle = '#2f3542';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('WARNER BROS. RECORDS INC. • ENHANCED CD', cx, cy + 220);
      ctx.font = '13px sans-serif';
      ctx.fillText('PRODUCED BY DON GILMORE • MIXED BY ANDY WALLACE', cx, cy + 260);
      ctx.fillText('© 2000 WARNER RECORDS INC.', cx, cy + 300);
      ctx.restore();
    }
  },

  {
    id: 13,
    title: "Star Wars: Revenge of the Sith",
    year: "2005",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "140 min",
    aspect: "2.35:1 Widescreen",
    audio: "Dolby Digital 5.1 Surround EX",
    tagline: "The circle is now complete.",
    synopsis: "Three years into the Clone Wars, the Jedi rescue Palpatine from Count Dooku. As Obi-Wan pursues a new threat, Anakin acts as a double agent between the Jedi Council and Palpatine.",
    quote: "\"It's over, Anakin! I have the high ground!\"",
    chapters: ["1. Battle Over Coruscant", "2. Grievous Escapes", "3. Tragedy of Darth Plagueis", "4. Execute Order 66", "5. Duel in the Senate", "6. Battle of the Heroes (Mustafar)", "7. Birth of the Twins & The Suit"],
    easterEgg: "Secret hip-hop music video with Yoda breakdancing (press '1138' on remote)!",
    themeColor: "#ff3f34",
    bgColor: "#1e0b06",
    accentColor: "#ffa801",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // Volcanic Mustafar lava backdrop
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#e55039');
      grad.addColorStop(0.4, '#b71540');
      grad.addColorStop(0.8, '#4a080d');
      grad.addColorStop(1, '#1e0507');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Lava glow cracks
      ctx.strokeStyle = '#f6b93b';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#e55039';
      ctx.shadowBlur = 10;
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 160, cy + Math.sin(ang) * 160);
        ctx.lineTo(cx + Math.cos(ang) * 440, cy + Math.sin(ang) * 440);
        ctx.stroke();
      }

      ctx.save();
      // Star Wars Logo
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.font = '900 48px "Franklin Gothic Medium", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeText('STAR WARS', cx, cy - 180);
      ctx.fillText('STAR WARS', cx, cy - 180);

      ctx.fillStyle = '#f6b93b';
      ctx.font = 'bold 28px serif';
      ctx.fillText('EPISODE III', cx, cy - 130);
      ctx.font = 'bold 22px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('REVENGE OF THE SITH', cx, cy - 95);

      // THX Certification Seal
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('THX CERTIFIED • DOLBY DIGITAL 5.1 EX', cx, cy + 220);

      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#f8a5c2';
      ctx.fillText('LUCASFILM LTD. • 20TH CENTURY FOX HOME ENT.', cx, cy + 280);
      ctx.fillText('© 2005 LUCASFILM LTD. & TM.', cx, cy + 310);
      ctx.restore();
    }
  },

  {
    id: 14,
    title: "Florida Vacation - Summer 2004",
    year: "2004",
    format: "DVD-R 4.7GB (Home Video)",
    region: "Home Recording (NTSC)",
    runtime: "118 min",
    aspect: "4:3 Standard (MiniDV)",
    audio: "Mono Built-in Camcorder Mic",
    tagline: "Digitized from Dad's Sony Handycam MiniDV tape.",
    synopsis: "Treasured family memories recorded on a handheld camcorder with constant zoom clicks, Dad's finger in the corner of the lens, and sunburns.",
    quote: "\"Hey, wave to the camera! Say hi to Grandma! Stop splashing your brother!\"",
    chapters: ["1. Packing the Minivan (6:00 AM)", "2. 14-Hour Drive & Gas Station Snacks", "3. Arriving at the Motel Pool", "4. Disney Magic Kingdom Fireworks", "5. Alligator Encounter at the Canal", "6. Beach Day Sunburn & Sandcastles"],
    easterEgg: "Dad accidentally left the camcorder recording inside his bag for 45 minutes of pitch black audio of muffled car conversations.",
    themeColor: "#ff9f43",
    bgColor: "#f5f6fa",
    accentColor: "#00d2d3",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // White Printable DVD-R Surface
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.7, '#f1f2f6');
      grad.addColorStop(1, '#dfe4ea');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Brand logo pre-printed faintly at top
      ctx.save();
      ctx.fillStyle = '#a4b0be';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('DVD-R  •  4.7GB  •  120 MIN VIDEO  •  1x-4x', 90, cy - 250);

      // Smudged blue/black Sharpie handwritten label
      ctx.fillStyle = '#0984e3';
      ctx.font = 'bold 42px "Comic Sans MS", "Caveat", cursive, sans-serif';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(cx, cy - 150);
      ctx.rotate(0.04);
      ctx.fillText('FLORIDA TRIP 2004 🌴☀️', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#2d3436';
      ctx.font = '24px "Comic Sans MS", "Caveat", cursive, sans-serif';
      ctx.fillText('(Disney, Pool & Beach Days)', cx, cy - 90);

      // Red Sharpie warning
      ctx.fillStyle = '#d63031';
      ctx.font = 'bold 32px "Comic Sans MS", cursive';
      ctx.fillText('⚠️ DO NOT ERASE!! ⚠️', cx, cy + 180);

      ctx.font = '22px "Comic Sans MS", cursive';
      ctx.fillStyle = '#636e72';
      ctx.fillText('Burned from Sony Handycam #2', cx, cy + 240);
      ctx.fillText('July 14-22, 2004', cx, cy + 280);
      ctx.restore();
    }
  },

  {
    id: 15,
    title: "Pulp Fiction",
    year: "1994",
    format: "DVD-VIDEO",
    region: "Region 1 (NTSC)",
    runtime: "154 min",
    aspect: "2.35:1 Widescreen",
    audio: "Dolby Digital 5.1 / DTS",
    tagline: "You won't know the facts until you've seen the fiction.",
    synopsis: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    quote: "\"Check out the big brain on Brett! You're a smart guy. That's right. The metric system.\"",
    chapters: ["1. The Diner Holdup", "2. Royale with Cheese", "3. Vincent Vega & Mia Wallace", "4. Jack Rabbit Slim's Twist Contest", "5. The Gold Watch", "6. The Bonnie Situation", "7. Ezekiel 25:17"],
    easterEgg: "Interactive trivia track and deleted scenes including the extended cab ride conversation with Esmeralda!",
    themeColor: "#fed330",
    bgColor: "#260e04",
    accentColor: "#eb3b5a",
    generateTexture: (ctx, width, height) => {
      const cx = width / 2;
      const cy = height / 2;

      // 70s Crime Noir Pulp yellow & deep crimson gradient
      const grad = ctx.createRadialGradient(cx, cy, 60, cx, cy, width * 0.48);
      grad.addColorStop(0, '#eb3b5a');
      grad.addColorStop(0.5, '#771324');
      grad.addColorStop(1, '#2c040b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Pulp border ring
      ctx.save();
      ctx.strokeStyle = '#fed330';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 220, 0, Math.PI * 2);
      ctx.stroke();

      // Bold Pulp 10-cent magazine typography
      ctx.fillStyle = '#fed330';
      ctx.font = '900 64px "Arial Black", impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 12;
      ctx.fillText('PULP FICTION', cx, cy - 160);

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px serif';
      ctx.fillText('A QUENTIN TARANTINO FILM', cx, cy - 110);

      // 10th Anniversary Badge
      ctx.fillStyle = '#fed330';
      ctx.beginPath();
      ctx.roundRect(cx - 180, cy + 180, 360, 44, 12);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('★ 10TH ANNIVERSARY COLLECTOR\'S EDITION ★', cx, cy + 208);

      // Miramax Home Entertainment
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('MIRAMAX HOME ENTERTAINMENT • DOLBY DIGITAL 5.1', cx, cy + 270);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#fa8231';
      ctx.fillText('WINNER OF PALME D\'OR - 1994 CANNES FILM FESTIVAL', cx, cy + 300);
      ctx.fillText('© 1994 MIRAMAX FILM CORP.', cx, cy + 325);
      ctx.restore();
    }
  }
];

// Helper to create Three.js CanvasTexture for any disc
export function createDiscTexture(discIndex) {
  const disc = DISCS[discIndex % DISCS.length];
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Draw disc boundary mask (outer circle & inner clear hole)
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 512, 500, 0, Math.PI * 2);
  ctx.clip();

  // Run custom disc artwork generator
  disc.generateTexture(ctx, 1024, 1024);

  // Clear inner spindle hole & clamping ring
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(512, 512, 70, 0, Math.PI * 2);
  ctx.fill();

  // Semi-transparent inner clamping hub ring
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(512, 512, 140, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  return { texture, canvas };
}
