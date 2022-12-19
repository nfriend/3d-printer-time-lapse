import { execSync } from 'child_process';
import { glob } from 'glob';

const now = Date.now();
const TMP_PIC_DIR = `/tmp/pics/${now}`;
const VIDEO_DIR = `/home/pi/timelapses`;
const VIDEO_FILE = `${VIDEO_DIR}/timelapse-${now}.mp4`;

// Download all the files from the camera to the local file system
execSync(`cd ${TMP_PIC_DIR} && gphoto2 --get-all-files`);

// Create the directory where we will store the time lapses (if it doesn't already exist)
execSync(`mkdir -p ${VIDEO_DIR}`);

// Get a list of all the pictures from the camera
const pics = glob.sync(`${VIDEO_DIR}/*.JPG`).sort();

// Stitch all the pictures into a video
execSync(`ffmpeg \
  -framerate 30 \
  -pattern_type glob -i '*.png' \
  -c:v libx264 \
  -pix_fmt yuv420p \
  ${VIDEO_FILE}
`);
