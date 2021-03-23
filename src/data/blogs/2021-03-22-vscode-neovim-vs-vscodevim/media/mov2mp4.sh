
filename="$1"
filename="${filename%.*}"


ffmpeg -i "$1" -vcodec h264 -acodec mp2 "$filename.mp4"



