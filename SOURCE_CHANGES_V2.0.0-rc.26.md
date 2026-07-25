# Source changes · v2.0.0-rc.26

## Oorzaak van de LinkedIn-fout

`canvas.captureStream(30)` leverde niet automatisch 30 opgeslagen frames per
seconde. De canvasinhoud veranderde alleen bij een volgende Play-stap, waardoor
de browserrecorder stilstaande tussenfasen vrijwel volledig oversloeg.

De gecontroleerde uitvoer had:

- WebM met VP9;
- 1200 × 627 pixels;
- 16 frames over circa 11,8 seconden;
- een gerapporteerde framerate van circa 2,6 fps;
- een effectieve bitrate van circa 105 kbps.

LinkedIn vereist voor gewone video onder meer 10–60 fps en minimaal 192 kbps.

## Formaatkeuze

`createPlayMediaRecorder()` probeert nu eerst MP4/H.264-containers die de
browser via `MediaRecorder.isTypeSupported()` aanbiedt. Daarna volgen WebM/VP9,
WebM/VP8 en de browserdefault.

De uitvoerextensie wordt afgeleid van het werkelijk gekozen MIME-type. De
zichtbare knop heet daarom algemeen `Play-video`.

## Framepomp

Waar `CanvasCaptureMediaStreamTrack.requestFrame()` beschikbaar is, gebruikt
de recorder:

```text
captureStream(0) → requestFrame() op iedere 30-fps-tik
```

Als die methode ontbreekt, houdt een onzichtbare wisselpixel het canvas actief
voor `captureStream(30)`. Beide routes voorkomen dat stilstaande Play-fasen
tot één enkel frame worden teruggebracht.

Het videobeeld is 1200 × 628. De even hoogte voorkomt H.264/YUV420-problemen.

## Controle

`tools/check_linkedin_video_export.py` bewaakt de MP4-voorkeur, de
WebM-fallback, de 30-fps-framepomp en de even videomaat. Met een videopad als
argument controleert het script via `ffprobe` ook codec, framerate, duur,
bitrate, bestandsgrootte en resolutie.

`tools/check_linkedin_video_runtime.js` voert de werkelijke formaatselectie en
beide framepomproutes uit met gecontroleerde browsermocks.
