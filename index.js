// plugin
const BackgroundSizePlugin = {
    name: "backgroundSize",
    getSize(target, config) {
      let o = {};
      BackgroundSizePlugin.init.call(o, gsap.utils.toArray(target)[0], config);
      return {width: o.sw + o.cw, height: o.sh + o.ch};
    },
    init(target, vars) {
      typeof(vars) !== "object" && (vars = {size: vars});
      let cs = window.getComputedStyle(target),
        imageUrl = cs.backgroundImage,
        {nativeWidth, nativeHeight, scale, size} = vars,
        parsedScale = scale || scale === 0 ? scale : 1,
        data = this,
        image, w, h, ew, eh, ratio, start, end,
        getSize = (size, scale) => {
          if (!/\d/g.test(size) || size.indexOf("%") > -1) {
            ratio = nativeWidth / nativeHeight;
            if (size === "cover" || size === "contain") {
              if ((size === "cover") === (nativeWidth / ew > nativeHeight / eh)) {
                h = eh;
                w = eh * ratio;
              } else {
                w = ew;
                h = ew / ratio;
              }
            } else { // "auto" or %
              size = size.split(" ");
              size.push("");
              w = ~size[0].indexOf("%") ? ew * parseFloat(size[0]) / 100 : nativeWidth;
              h = ~size[1].indexOf("%") ? eh * parseFloat(size[1]) / 100 : nativeHeight;
            }
          } else {
            size = size.split(" ");
            size.push(nativeHeight);
            w = parseFloat(size[0]) || nativeWidth;
            h = parseFloat(size[1]);
          }
          return {w: Math.ceil(w * scale), h: Math.ceil(h * scale)};
        };
      if (imageUrl) {
        if (!nativeWidth || !nativeHeight) {
          image = new Image();
          image.setAttribute("src", imageUrl.replace(/(^url\("|^url\('|^url\(|"\)$|'\)$|\)$)/gi, ""));
          nativeWidth = image.naturalWidth;
          nativeHeight = image.naturalHeight;
        }
        ew = target.offsetWidth;
        eh = target.offsetHeight;
        if (!nativeWidth || !nativeHeight) {
          console.log("bgSize() failed;", imageUrl, "hasn't loaded yet.");
          nativeWidth = ew;
          nativeHeight = eh;
        }
        size || (size = cs.backgroundSize);
        start = getSize(cs.backgroundSize, 1);
        end = getSize(size, parsedScale);
        data.size = parsedScale === 1 ? size : end.w + "px " + end.h + "px";
        data.style = target.style;
        data.sw = start.w;
        data.cw = end.w - start.w;
        data.sh = start.h;
        data.ch = end.h - start.h;
      }
    },
    render(ratio, data) {
      data.style.backgroundSize = ratio === 1 ? data.size : (data.sw + data.cw * ratio).toFixed(1) + "px " + (data.sh + data.ch * ratio).toFixed(1) + "px";
    }
  };
  gsap.registerPlugin(BackgroundSizePlugin, ScrollTrigger);

// Landing animation
  const timeLine = gsap.timeline();
timeLine.from('#name, #vision', {opacity: '0', delay: 1, duration: 2,  ease: "slow(0.05, 0.7, false)"})
    .from('.links, .fblink', {opacity: '0', stagger: 0.5, duration: 2});

// poem animation
gsap.from('#poem', {
    scrollTrigger: {
        trigger: '.letter_container',
        start: 'top center'
    },
    x: '-100%', display: 'hidden', opacity: '0', duration: 2, ease: 'power2'});

//schedule animation
    gsap.from('#schedule_head, .appointments', {
        scrollTrigger: {
            trigger: '.letter_container',
            start: 'top center'
        },
        opacity: '0', x: '100%', stagger: 0.5, duration: 3, ease: 'power2'}) 