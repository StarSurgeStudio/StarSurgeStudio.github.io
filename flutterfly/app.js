//VIDEO PRELOAD
var req = new XMLHttpRequest();
req.open('GET', 'https://starsurgestudio.github.io/imgs/FlutterFly_Launch_intro.mp4', true);
req.responseType = 'blob';

req.onload = function() {
   // Onload is triggered even on 404
   // so we need to check the status code
   if (this.status === 200) {
      var videoBlob = this.response;
      var vid = URL.createObjectURL(videoBlob); // IE10+
      // Video is now downloaded
      // and we can set it as source on the video element
      video.src = vid;
   }
}
req.onerror = function() {
   // Error
}

req.send();

//NAV LINKS SWITCHER
window.onload = () => {
    const tab_switchers = document.querySelectorAll('[data-switcher]');

    for (let i = 0; i < tab_switchers.length; i++) {
        const tab_switcher = tab_switchers[i];
        const page_id = tab_switcher.dataset.tab;

        tab_switcher.addEventListener('click', () => {
            document.querySelector('.tabs .tab.is-active').classList.remove('is-active');
            tab_switcher.parentNode.classList.add('is-active');

            SwitchPage(page_id);
        });
    }
}

function SwitchPage (page_id) {
    console.log(page_id);

    const current_page = document.querySelector('.pages .page.is-active');
    current_page.classList.remove('is-active');

    const next_page = document.querySelector(`.pages .page[data-page="${page_id}"]`);
    next_page.classList.add('is-active');
}

//SCROLLMAGIC START

const intro = document.querySelector('.intro');
const video = intro.querySelector('video');
const text = intro.querySelector('h1');

const section = document.querySelector('section');
const end = section.querySelector('h1');

var controller = new ScrollMagic.Controller();

//Scenes


//Pinning 2nd screen

//All animations
var scene2 = new ScrollMagic.Scene({
    triggerElement: '#htext',
    offset: 30
})
.setClassToggle('#htext', 'active')
.addTo(controller);

var scene3 = new ScrollMagic.Scene({
    triggerElement: '#nvme',
})
.setClassToggle('#nvme', 'active')
.addTo(controller);

var scene4 = new ScrollMagic.Scene({
    triggerElement: '#twomain',
})
.setClassToggle('#twomain', 'active')
.addTo(controller);


var scene6 = new ScrollMagic.Scene({
    triggerElement: '#img1',
    offset: -165
})
.setClassToggle('#img1', 'active')
.addTo(controller);

var scene7 = new ScrollMagic.Scene({
    triggerElement: '#img2',
    offset: -465
})
.setClassToggle('#img2', 'active')
.addTo(controller);

document.querySelectorAll('[data-audio-toggle]').forEach(function (button) {
    var media = document.querySelector(button.getAttribute('data-audio-toggle'));
    if (!media) {
        return;
    }

    button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        var turnOn = media.muted || media.volume === 0;
        media.muted = !turnOn;
        media.volume = turnOn ? 1 : 0;
        if (turnOn && typeof media.play === 'function') {
            media.play().catch(function () {});
        }
        button.setAttribute('aria-pressed', turnOn ? 'true' : 'false');
        button.textContent = turnOn ? 'Sound on' : 'Sound off';
        button.setAttribute('aria-label', turnOn ? 'Turn soundtrack off' : 'Turn soundtrack on');
    });
});