# Thoreson Estate Dinner Website - Updates Summary

## Changes Made (February 17, 2025)

### 1. Updated index.html
- **Changed:** Guest list loading function
- **From:** Pulling guest names from Google Sheets (async/CSV)
- **To:** Loading from hardcoded character data in JavaScript
- **Result:** Guest list now shows character names with IRL names in format: "Character Name (IRL Name)"
- **Example:** Scott Thoreson Jr. (Scott), Miranda Leanna Hartley (Leanna), Walter Lippman (Marc)
- **Each guest name is now clickable** and links to `character.html?id=[character-id]`

### 2. Created character.html
- **New file:** Complete individual character pages
- **Features:**
  - Public information visible without password
  - Password-protected detailed information
  - Supports BOTH individual access codes AND master code
  - All 21 characters with complete backstories, knowledge, goals, relationships, items, and skills
  - Master access note appears when using master code

### 3. Access Codes

**Master Code:** `THORESON1935`
- Use this to see ALL characters' full information
- Will show a "MASTER ACCESS" note on character pages

**Individual Character Codes:**
- Scott Thoreson Jr. - SCOTT-7M2K
- Frederick Brian T. Thoreson - BRIAN-4L9T
- Charlotte Clara Waverly - CLARA-5P8X
- Miranda Leanna Hartley - LEANN-3Q1W
- Walter Lippman (Marc) - MARC-6N7J
- Sophie Maisy Vanderpool - MAISY-2H5B
- Vivienne Ashford (Hannah) - HANNAH-8V4K
- David Richardson (DJ) - DJ-9R2F
- Raymond Hammond (Peter) - PETER-1Y6C
- Marcus Brennan (Arash) - ARASH-7G3D
- Victoria Ashworth (Becky) - BECKY-4K8L
- Thomas Bradford (Brian S.) - THOMAS-5E7M
- Margaret Ashford (Katie) - MARGA-2W9Z
- Dorothy Wells (Michelle) - DOROTHY-6X1P
- Charles Sterling (Jeff) - CHARLES-3T4Q
- Patricia Chamberlain (Casey) - PATRICIA-8V5K
- Victoria Grant (Krystal) - VICTORIA-7J2X
- Elizabeth Monroe (Lindsey) - ELIZABETH-4N8L
- James Sterling (Bradey) - JAMES-9S6B
- William Chamberlain (Alexander) - WILLIAM-5C1W
- Robert Chamberlain (Jesse) - ROBERT-2H7Y

## How Guests Access Their Character Info

1. **Visit:** https://thoresonws-pixel.github.io/Thoreson_Estate_Dinner/#guests
2. **See:** List of all 21 characters with public info (no password needed)
3. **Click:** On their character name
4. **See:** Character page with public information
5. **Enter:** Their individual access code
6. **Unlock:** Full backstory, knowledge, secrets, goals, relationships, items, and skills

## For You (Game Master)

- Use **master code: THORESON1935** to view any character's full information
- Use individual codes to verify guests are using the right code
- You can change the master code by editing the `MASTER_CODE` variable in character.html

## Files Modified/Created

- ✅ `/index.html` - Updated guest loading function
- ✅ `/character.html` - Created new character page template with full database

## Next Steps

1. **Push to GitHub:** `git add .` then `git commit -m "Update guest list and add character pages"`
2. **Test the site:** 
   - Visit your website
   - Click on a guest name
   - Try entering an access code
3. **Share with guests:** Give each guest their individual access code before the party

## Technical Details

- Character database is embedded in character.html (21 characters, all data included)
- URL parameter `?id=` used to load specific character (e.g., `character.html?id=scott-thoreson-jr`)
- Password verification is client-side (JavaScript)
- No server-side authentication needed

---

**Last Updated:** February 17, 2025
**Website:** https://thoresonws-pixel.github.io/Thoreson_Estate_Dinner/
**Repository:** https://github.com/thoresonws-pixel/Thoreson_Estate_Dinner
