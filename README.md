# radar

----------
Fetcha en radarbild från SMHI.se API och visa den på en websida.

Fetchar senaste bilden samt de 7 senaste bilderna efter det.

Radarbilderna sparas i sessionen men försvinner om sidan laddas om.

En tabell skrivs ut där tidslaget för bilderna visas samt det highlightas vilken bild du just nu tittar på. Tabellen är klickbar så bara klicka på cellerna så kommer du till resp. bild.

Man kan gå framåt samt bakåt mha fram och bak knapparna och även köra ett bildspel med alla bilder som sparats i din session.

Varsågod att använd koden. Du får gärna ge mig någon form av kudos för skiten genom att forka den...bara så det ser snyggt ut i statistiken.

# OBS
Sidan autofetchar varannan minut och kollar efter nyare radarbilder. Vill du ta bort eller ändra detta editera setInterval i main funktionen.
