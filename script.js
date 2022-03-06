var win = nw.Window.get();
win.moveTo(150, 150)

let audio = {
    currentRadio: 0,
    radioList: [`Radio Sonar`, `Radio Top-40`, `Radio Retro`, `Radio Jazz`],
    radioLink: [`http://185.174.136.152:8000/play`, `http://185.174.136.152:8000/top40`, `http://185.174.136.152:8000/retro`, `http://185.174.136.152:8000/jazz`],
    radioShort: [`Sonar`, `Top40`, `Retro`, `Jazz`],
    volume: 0.25,
    playState: false,
    data: {
        title: ``,
        imageLink: ``
    },
    init: function () {
        var $that = this;
        $(function () {
            $that.components.media();
        });
    },

    controls: {
        next: function () {
            let radioName = document.getElementById(`radioName`)
            if (audio.currentRadio == 3) audio.currentRadio = -1
            audio.currentRadio++
            radioName.innerHTML = audio.radioShort[audio.currentRadio]
            audio.components.updateStation()
        },
        prev: function () {
            let radioName = document.getElementById(`radioName`)
            if (audio.currentRadio == 0) audio.currentRadio = 4
            audio.currentRadio--
            radioName.innerHTML = audio.radioShort[audio.currentRadio]
            audio.components.updateStation()
        }
    },

    components: {
        media: function (target) {
            var media = $('audio.fc-media', (target !== undefined) ? target : 'body');
            if (media.length) {
                media.mediaelementplayer({
                    audioHeight: 40,
                    features: ['playpause', 'current', 'duration', 'progress', 'volume', 'tracks', 'fullscreen'],
                    alwaysShowControls: true,
                    timeAndDurationSeparator: '<span></span>',
                    iPadUseNativeControls: true,
                    iPhoneUseNativeControls: true,
                    AndroidUseNativeControls: true
                });
            }
        },

        updateTrack: function (fullName, coverLink) {
            let cover = document.getElementById(`cover`)
            let nick = document.getElementById(`nick`)
            let name = document.getElementById(`name`)
            let player = document.getElementById(`backCover`)

            let songName = fullName.split(' - ')[1]
            let songArtist = fullName.split(' - ')[0]
            if (!songName || !songArtist || songArtist == ' ') {

                songName = fullName.split(' - ')[2]
                songArtist = fullName.split(' - ')[1]
            }
            nick.innerHTML = songArtist
            name.innerHTML = songName
            if (nick.innerHTML.length > 14) {
                if (nick.classList.contains(`nonmarquee`)) {
                    nick.classList.remove(`nonmarquee`)
                }
                if (!nick.classList.contains(`marquee`)) nick.classList.add(`marquee`)
            } else {
                if (nick.classList.contains(`marquee`)) {
                    nick.classList.remove(`marquee`)
                }
                if (!nick.classList.contains(`nonmarquee`)) nick.classList.add(`nonmarquee`)
            }

            if (name.innerHTML.length > 14) {
                if (name.classList.contains(`nonmarquee`)) {
                    name.classList.remove(`nonmarquee`)
                }
                if (!name.classList.contains(`marquee`)) name.classList.add(`marquee`)
            } else {
                if (name.classList.contains(`marquee`)) {
                    name.classList.remove(`marquee`)
                }
                if (!name.classList.contains(`nonmarquee`)) name.classList.add(`nonmarquee`)
            }
            cover.src = coverLink
            player.src = coverLink
        },

        updateStation: function () {
            let playRadio = document.getElementById(`rplay`)
            let topRadio = document.getElementById(`rtop`)
            let retroRadio = document.getElementById(`rretro`)
            let jazzRadio = document.getElementById(`rjazz`)
            playRadio.volume = audio.currentRadio == 0 && audio.playState ? audio.volume : 0
            topRadio.volume = audio.currentRadio == 1 && audio.playState ? audio.volume : 0
            retroRadio.volume = audio.currentRadio == 2 && audio.playState ? audio.volume : 0
            jazzRadio.volume = audio.currentRadio == 3 && audio.playState ? audio.volume : 0
        }

    },
};
audio.init();

async function loadImage(uri) {
    try {
        uri = `https://itunes.apple.com/search?term=${uri.split(' ').join('+')}`
        let img = await axios.get(uri).then(res => {
            return res.data.results[0]?.artworkUrl100.replace(`100x100bb`, '1000x1000bb')
        })
        return img
    } catch (err) {}
}

setInterval(() => {
    try {
        (async () => {
            if (audio.data.title) audio.components.updateTrack(audio.data.title, audio.data.imageLink)
            axios.get(`http://185.174.136.152:8000/status2.xsl`).then(res => {
                res.data.split(' | ').forEach(async (radioStationSoruce) => {
                    if (radioStationSoruce.split(':')[0] == audio.radioList[audio.currentRadio]) {
                        let radioStation = {
                            title: radioStationSoruce.split(':')[1]
                        }
                        audio.data = {
                            title: radioStation.title,
                            imageLink: await loadImage(radioStation.title) || `https://sonar-rp.ru/app/${radioStationSoruce.split(':')[0].replace('Radio ', '').toLowerCase()}.jpg`
                        }
                    }
                })
            })
        })();
    } catch (err) {}
}, 500)

let audioPlayer = document.createElement('audioElem')

function switchPlayPause() {
    audio.playState = !audio.playState

    let playRadio = document.getElementById(`rplay`)
    let topRadio = document.getElementById(`rtop`)
    let retroRadio = document.getElementById(`rretro`)
    let jazzRadio = document.getElementById(`rjazz`)

    if (audio.playState) {

        let pauseButton = document.getElementById('pause')
        pauseButton.style.display = 'block'
        let playButton = document.getElementById('play')
        playButton.style.display = 'none'
        playRadio.volume = audio.currentRadio == 0 ? audio.volume : 0
        topRadio.volume = audio.currentRadio == 1 ? audio.volume : 0
        retroRadio.volume = audio.currentRadio == 2 ? audio.volume : 0
        jazzRadio.volume = audio.currentRadio == 3 ? audio.volume : 0
    } else {
        let playButton = document.getElementById('play')
        playButton.style.display = 'block'
        let pauseButton = document.getElementById('pause')
        pauseButton.style.display = 'none'

        playRadio.volume = 0
        topRadio.volume = 0
        retroRadio.volume = 0
        jazzRadio.volume = 0
    }
}

setInterval(() => {

    let playRadio = document.getElementById(`rplay`)
    let topRadio = document.getElementById(`rtop`)
    let retroRadio = document.getElementById(`rretro`)
    let jazzRadio = document.getElementById(`rjazz`)

    playRadio.volume = audio.currentRadio == 0 && audio.playState ? audio.volume : 0
    topRadio.volume = audio.currentRadio == 1 && audio.playState ? audio.volume : 0
    retroRadio.volume = audio.currentRadio == 2 && audio.playState ? audio.volume : 0
    jazzRadio.volume = audio.currentRadio == 3 && audio.playState ? audio.volume : 0
})

const slider = document.getElementById("volume")
const min = slider.min
const max = slider.max
const value = slider.value

slider.style.background = `linear-gradient(to right, #5bbb95 0%, #5bbb95 ${(value-min)/(max-min)*100}%, #DEE2E6 ${(value-min)/(max-min)*100}%, #DEE2E6 100%)`

slider.oninput = function () {
    this.style.background = `linear-gradient(to right, #5bbb95 0%, #5bbb95 ${(this.value-this.min)/(this.max-this.min)*100}%, #DEE2E6 ${(this.value-this.min)/(this.max-this.min)*100}%, #DEE2E6 100%)`
};

$("#volume").mousemove(function () {
    audio.volume = parseFloat(this.value / 10);
});

document.oncontextmenu = cmenu;

function cmenu() {
    return false;
}

function preventSelection(element) {
    var preventSelection = false;

    function addHandler(element, event, handler) {
        if (element.attachEvent) element.attachEvent('on' + event, handler);
        else if (element.addEventListener) element.addEventListener(event, handler, false);
    }

    function removeSelection() {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.selection && document.selection.clear)
            document.selection.clear();
    }

    addHandler(element, 'mousemove', function () {
        if (preventSelection) removeSelection();
    });
    addHandler(element, 'mousedown', function (event) {
        var event = event || window.event;
        var sender = event.target || event.srcElement;
        preventSelection = !sender.tagName.match(/INPUT|TEXTAREA/i);
    });

    function killCtrlA(event) {
        var event = event || window.event;
        var sender = event.target || event.srcElement;
        if (sender.tagName.match(/INPUT|TEXTAREA/i)) return;
        var key = event.keyCode || event.which;
        if ((event.ctrlKey && key == 'U'.charCodeAt(0)) || (event.ctrlKey && key == 'A'.charCodeAt(0)) || (event.ctrlKey && key == 'S'.charCodeAt(0))) // 'A'.charCodeAt(0) можно заменить на 65
        {
            removeSelection();
            if (event.preventDefault) event.preventDefault();
            else event.returnValue = false;
        }
    }
    addHandler(element, 'keydown', killCtrlA);
    addHandler(element, 'keyup', killCtrlA);
}
preventSelection(document);

document.ondragstart = test;
document.onselectstart = test;
document.oncontextmenu = test;

function test() {
    return false
}

function enableHint() {
    document.getElementById(`firstMessage`).style.display = 'block'
    let interval = setInterval(() => {
        let cover = document.getElementById(`coverZone`)
        cover.style.border = `15px outset #9145FF`
        setTimeout(() => {
            cover.style.border = `17px outset #2EA2FF`
        }, 500)
    }, 1000)

    setTimeout(() => {
        clearInterval(interval)
        setTimeout(() => cover.style.border = `0px solid #1C6EA4`, 500)
    }, 5000)
}