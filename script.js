const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const artistInfo=document.querySelector(".artist-info");
const progressCircle=document.querySelector(".progress-circle");
const body  = document.querySelector("body");
const volumeRange= document.querySelector(".volume-range");
const volumeProgressBar=document.querySelector(".v-progress-bar");
const backgroundiMage=document.querySelector(".background-image");
const songListContainer= document.querySelector(".song-list-container");
const listIcon=document.querySelector(".list-icon-container");
const imgProgressInfoWrap=document.querySelector(".img-info-progress-wrap");
const infoContainerPlaying=document.querySelector(".playing-info-container")
const playingImg=document.querySelector(".container-a");
const playingArtist=document.querySelector(".single-line-text");
const playingTitle=document.querySelector(".single-line-text1");
const playingIcon=document.querySelector('.container-c');
const songList=document.querySelector(".song-list-wrapper");
const nowPlayingContainer= document.querySelector('.now-playing-container')
const repeat = document.querySelector('.repeat');
const shuffle = document.querySelector('.shuffle');







music.volume=0.1;
const styleSheet=document.styleSheets[1];
const styleSheetRules=styleSheet.cssRules;
let progressAfter;
let repeatAfter;



//This loop gets the css rules
for (i=0;i<styleSheetRules.length;i++){
  if (styleSheetRules[i].selectorText=== '.progress::after')
    progressAfter=styleSheetRules[i];

  else if (styleSheetRules[i].selectorText=== '.repeat::before')
    repeatAfter=styleSheetRules[i];
}
      

const cloneRepeat=repeat.cloneNode(true);
cloneRepeat.style.height='0.8rem';
cloneRepeat.style.width='0.8rem';
cloneRepeat.classList.replace('repeat','jo');
const cloneShuffle=shuffle.cloneNode(true);
cloneShuffle.style.height='0.8rem';
cloneShuffle.style.width='0.8rem';

listIcon.appendChild(cloneRepeat);
listIcon.appendChild(cloneShuffle);


const style = document.createElement('style');
document.head.appendChild(style);

 
function resetKeyFrames(){


if (playingArtist.clientWidth <200){
playingArtist.style.animation='none';
}else{
playingArtist.style.animation='none';
void playingArtist.offsetWidth // Trigger reflow to force the browser to recognize the change
playingArtist.style.animation='translate-left 15s 1s linear infinite';
}

if (playingTitle.clientWidth < 200){
playingTitle.style.animation='none';
}else{
playingTitle.style.animation='none';
void playingTitle.offsetWidth // Trigger reflow to force the browser to recognize the change
playingTitle.style.animation='translate-left 15s 3s linear infinite';
}


if (artist.textContent.length < 15){
  artist.style.animation='none';
  }else{
  artist.style.animation='none';
  void artist.offsetWidth // Trigger reflow to force the browser to recognize the change
  artist.style.animation='translate-left 15s 3s linear infinite';
  }

  if (title.textContent.length < 15){
    title.style.animation='none';
    }else{
    title.style.animation='none';
    void title.offsetWidth // Trigger reflow to force the browser to recognize the change
    title.style.animation='translate-left 15s 1s linear infinite';
    }
    

} 


// Music
let songs = []
let started = false

 let listSongIndex=0;

 let songsCopy=songs;

 const history=[];


//Activate repeat
let onRepeat=''

//Activate shuffle 
let onShuffle=false;

let loadOnShuffle=false;

// Check if Playing
let isPlaying = false;

// Play
function playSong() {
  isPlaying = true;
  started=true
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
  music.play();
}

// Pause
function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  music.pause();
}

 
function stopSong(){
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  loadSong(songs[songIndex])

}

// Update DOM
function loadSong(song) {
 
  
  title.textContent = song.title? song.title : 'Unknown';
  artist.textContent = song.artist? song.artist :"Unknown"
  let no_artwork= "img/empty_music_artwork.png";
  music.src = song.path;
  const imagePath=song.artwork? song.artwork : no_artwork
  image.src = imagePath
  backgroundiMage.style.setProperty('background-image',`url(${imagePath})`)
  playingArtist.textContent=song.artist? song.artist :"Unknown"
  playingTitle.textContent=song.title? song.title :"Unknown"
  playingImg.style.setProperty("background-image",`url(${imagePath})`)
  resetKeyFrames()
  listSongs()
  listSongIndex=songIndex;

  if (history.length <songsCopy.length){
    history.push(song);
  }
 
  if (onShuffle){
    loadOnShuffle=true;
  }
}

// Current Song
let songIndex = 0;

// Previous Song
function prevSong() {
  songIndex--;
  
  if (songIndex < 0) {
    songIndex = songs.length - 1;
     
  }
  loadSong(songs[songIndex]);
  if (started)playSong();


}

let playedAllSongs=false;

// Next Song
function nextSong(e) {
 
  
  if ( e.type === 'ended' && songIndex === songs.length-1){
    playedAllSongs=true;
   }
  songIndex++;
   
  if (songIndex > songs.length - 1 ) {
    songIndex=0;
     
  }


  //Repeat current song
  if (onRepeat === 'single' && e.type === 'ended'){
    songIndex--;
  }


  //This block prevent the next song form playing
  //if all songs in the list has been played 

  if (songIndex === 0 && onRepeat !== 'all'){
    stopSong();
    started=false;
    isPlaying=false;
    

  }else{loadSong(songs[songIndex]);
    if (started)playSong();}
   

}

function songCanplay(e){
  const { duration, currentTime } = e.srcElement;
  // Calculate display for duration
  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration % 60);
  if (durationSeconds < 10) {
    durationSeconds = `0${durationSeconds}`;
  }
  // Delay switching duration Element to avoid NaN
  if (durationSeconds) {
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }
  // Calculate display for currentTime
  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
 
}


// On Load - Select First Song
fetch("metadata.json").then(response => response.json()).then(
  data => {
    songs=data
    songsCopy=songs;
    loadSong(songs[songIndex]);
  })
 

// Update Progress Bar & Time
function updateProgressBar(e) {
  
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    // Update progress bar width
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    progressAfter.style.setProperty("left",`${progressPercent-2}%`)

    // Calculate display for duration
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) {
      durationSeconds = `0${durationSeconds}`;
    }
    // Delay switching duration Element to avoid NaN
    if (durationSeconds) {
      durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
    // Calculate display for currentTime
    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) {
      currentSeconds = `0${currentSeconds}`;
    }
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
   
  }
}

function updateVolumeBar(range){
 volumeProgressBar.style.width=`${range*100}%`
 music.volume=range
}


function setProgressBar(e) {
 
  if (e.target.className === 'progress-container' || e.target.className ==='progress'){
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const { duration } = music;
  music.currentTime = (clickX / width) * duration;
  }
  else if (e.target.className === "volume-range" || e.target.className === "v-progress-bar"){
    let volume=e.offsetX/this.clientWidth;
    updateVolumeBar(volume);
  }
 
}

function handleMouseMove(e){
 
  if (e.target.className === 'progress-container' || e.target.className ==='progress'){
  if (isPlaying){
  const width = this.clientWidth;
  const dragX=e.offsetX;
  const { duration } = music;
  music.currentTime = (dragX/ width) * (duration+6);
  progressAfter.style.setProperty("filter","brightness(0.1)")
  progress.style.border="2.2px solid  #232424"
  }}

  else if (e.target.className === "volume-range" || e.target.className === "v-progress-bar"){
    let volume=e.offsetX/this.clientWidth
    
    updateVolumeBar(volume)
  }

}

//current widget index
curWidgetIndex=0
function showWidget(e){
  if (curWidgetIndex == 0){
    imgProgressInfoWrap.style.display="none";
    songListContainer.style.display="block";
    e.target.parentNode.classList.add("list-active")
    curWidgetIndex++;
    resetKeyFrames()
    cloneRepeat.classList.remove('list-icon-active');
    cloneShuffle.classList.remove('list-icon-active');
    cloneRepeat.classList.replace('repeat','jo');
    
  }
  else{
    imgProgressInfoWrap.style.display="block";
    songListContainer.style.display="none";
    e.target.parentNode.classList.remove("list-active")
    curWidgetIndex=0;
    resetKeyFrames()
    if ( onRepeat){
      cloneRepeat.classList.replace('jo','repeat');
    cloneRepeat.classList.add('list-icon-active');}
    else if (onShuffle){
    cloneShuffle.classList.add('list-icon-active');
  }
    
  }

  listSongs()

}

let repeatCount=0;
function handleRepeatClick(e){

repeatCount++;

if (repeatCount === 1){
  e.target.classList.add('active-icon');
  onRepeat='all';
}

else if (repeatCount === 2){
  
  repeatAfter.style.setProperty('display','inline');
  onRepeat= 'single'; 
}

else if (repeatCount == 3){
  repeatAfter.style.setProperty('display','none');
  e.target.classList.remove('active-icon');
  repeatCount=0;
  onRepeat=false;
}


}

let alteredIndex=0;

function handleShuffleClick(e){
  e.target.classList.toggle('active-icon');

 

  if (e.target.className.split(' ').includes('active-icon')){
   
  var alteredList=songsCopy.filter((element)=>!history.slice(-1).includes(element)
   );
   loadOnShuffle=false;
   onShuffle=true;
  songs=shuffleArray(alteredList);
  songIndex=0;
  listSongs()
   
  }else{
    if (loadOnShuffle)songIndex=songsCopy.indexOf(songs[songIndex]);
    
    onShuffle=false;
    songs=songsCopy;
    listSongs();
  }


  }


  //The Fisher-Yates shuffle algorithm. 
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
         
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
   
    return array;
}



function handleMouseClick(e){
  console.log(e)

}

function removeChildren(element){
  while(element.firstChild){
    element.removeChild(element.firstChild)
  }
}

function handleListItem(e){
  let currEl=e.target;
 let targetElement=''
 if (e.target.className === 'now-playing-container'){
  targetElement=e.target;
 }else{
 while (currEl.parentElement?.className !== 'now-playing-container'){

  currEl =currEl?.parentElement;
 }

 }
 
 if (!targetElement)targetElement=currEl.parentElement;
 else targetElement=targetElement;


songIndex=(Number(targetElement.id)+listSongIndex)+1;
loadSong(songs[(Number(targetElement.id)+listSongIndex)+1])
playSong();


}

function listSongs(){

  removeChildren(songList);
  const playingSonIndex=songs.findIndex((element)=>element===songs[songIndex])
  let songsList=songs.slice(playingSonIndex+1);


  songsList.forEach((element,index) => {

  let no_artwork= "img/empty_music_artwork.png";
  const imagePath=element.artwork?element.artwork:no_artwork;
  const artist=element.artist?element.artist:'Unknown';
  const title =element .title?element.title:'Unknown';


  const cloneElement=nowPlayingContainer.cloneNode(true);
  cloneElement.children['0'].style.setProperty("background-image",`url(${imagePath})`);
  const singleText=cloneElement.children['1'].children['0'].children['0'];
  const singleText1=cloneElement.children['1'].children['1'].children['0'];
  
  singleText.textContent=artist;
  singleText.style.animation='none';
  singleText1.textContent=title;
  singleText1.style.animation='none';

  const listIcon=cloneElement.children['2'];
  listIcon.className='container-c-list';
  listIcon.textContent='';
  for (i=0; i<3; i++){
    const div=document.createElement('div');
    div.style.width='20px';
    div.style.height='5px';
    div.style.borderRadius='20%';
    div.style.marginBottom='2px';
    div.style.setProperty('background-color','rgb(129, 129, 129)')
    listIcon.appendChild(div);
  }
  

  cloneElement.style.height='4rem';
  cloneElement.style.marginBottom='3px';
  cloneElement.id=`${index}`;

  cloneElement.addEventListener('click',(e)=>handleListItem(e));
  songList.appendChild(cloneElement);
  

  });

  


   
}

// Event Listeners

// Play or Pause Event Listener
playBtn.addEventListener('click', () => ( isPlaying ? pauseSong() : playSong())

  );


repeat.addEventListener('click', (e)=>handleRepeatClick(e));
shuffle.addEventListener('click',(e)=>handleShuffleClick(e));
listIcon.addEventListener("click",showWidget);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
music.addEventListener('canplay',songCanplay);
playingIcon.addEventListener('click',handleMouseClick);
progressContainer.addEventListener('click', setProgressBar);

progressContainer.addEventListener("mousedown",(e)=>{
  
  progressContainer.addEventListener("mousemove",handleMouseMove)
})
progressContainer.addEventListener("mouseup",(e)=>{
  
  progressAfter.style.setProperty("filter","brightness(1)")
  
  progressContainer.removeEventListener("mousemove",handleMouseMove)
})

progressContainer.addEventListener("mouseleave",(e)=>{
 
  progressAfter.style.setProperty("filter","brightness(1)")
 
  progressContainer.removeEventListener("mousemove",handleMouseMove)
})



volumeRange.addEventListener('click', setProgressBar);

volumeRange.addEventListener("mousedown",(e)=>{
  
  volumeRange.addEventListener("mousemove",handleMouseMove)
})
volumeRange.addEventListener("mouseup",(e)=>{
  
 
  volumeRange.removeEventListener("mousemove",handleMouseMove)
})

volumeRange.addEventListener("mouseleave",(e)=>{
 
  volumeRange.removeEventListener("mousemove",handleMouseMove)
})






// window.addEventListener("resize",(event)=>{
// if (Math.ceil(artistInfo.getBoundingClientRect().height)==47){
//   fontSize(songs[songIndex]);
// }
// else fontSize(songs[songIndex]);
// })


body.addEventListener("keypress",(e)=>{
  e.preventDefault()
   console.log(e.charCode)
  if (e.charCode === 32){
    if (isPlaying)pauseSong();
    else playSong()
  }
  else if (e.charCode === 110){
    nextSong()
  }

  else if (e.charCode === 112){
    prevSong()
  }
})