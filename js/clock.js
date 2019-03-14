// thooClock, a jQuery Clock with alarm function
// by Thomas Haaf aka thooyork, http://www.smart-sign.com
// Twitter: @thooyork
// Version 0.9.20
// Copyright (c) 2013 thooyork

// MIT License, http://opensource.org/licenses/MIT

// Heavyily adapted. Removed alarm function. Use DST aware timezones (via luxon) instead of
// hourCorrection. Added minute and meridiem callbacks.

(function( $ ) {
    $.fn.thooClock = function(options) {
        this.each(function() {
            var defaults = {
                size: 250,
                dialColor: '#000000',
                dialBackgroundColor: 'transparent',
                secondHandColor: '#F32222',
                minuteHandColor: '#222222',
                hourHandColor: '#222222',
                timeZone: 'local',
                showNumerals: true
            };

            var settings = $.extend({}, defaults, options);

            var el = this;

            el.size = settings.size;
            el.dialColor = settings.dialColor;
            el.dialBackgroundColor = settings.dialBackgroundColor;
            el.secondHandColor = settings.secondHandColor;
            el.minuteHandColor = settings.minuteHandColor;
            el.hourHandColor = settings.hourHandColor;
            el.timeZone = settings.timeZone;
            el.showNumerals = settings.showNumerals;

            el.brandText = settings.brandText;
            el.brandText2 = settings.brandText2;

            var cnv = document.createElement('canvas');
            var ctx = cnv.getContext('2d');

            cnv.width = this.size;
            cnv.height = this.size;

            $(cnv).appendTo(el);

            var radius = parseInt(el.size / 2, 10);

            //translate 0,0 to center of circle:
            ctx.translate(radius, radius);

            function toRadians(deg) {
                return (Math.PI / 180) * deg;
            }

            function drawDial(color, bgcolor) {
                var dialRadius = parseInt(radius - (el.size / 50), 10);
                var dialBackRadius = radius - (el.size / 400);

                ctx.beginPath();
                ctx.arc(0, 0, dialBackRadius, 0, 360, false);
                ctx.fillStyle = bgcolor;
                ctx.fill();


                for(var i = 1; i <= 60; i += 1) {
                    var ang = Math.PI / 30 * i;
                    var sang = Math.sin(ang);
                    var cang = Math.cos(ang);

                    var sx, sy, ex, ey;

                    if (i % 5 === 0) {
                        // hour marker/numeral
                        ctx.lineWidth = parseInt(el.size / 50,10);
                        sx = sang * (dialRadius - dialRadius / 9);
                        sy = cang * -(dialRadius - dialRadius / 9);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                        var nx = sang * (dialRadius - dialRadius / 4.2);
                        var ny = cang * -(dialRadius - dialRadius / 4.2);
                        var text = i / 5;
                        ctx.textBaseline = 'middle';
                        var textSize = parseInt(el.size / 13,10);
                        ctx.font = '100 ' + textSize + 'px helvetica';
                        var textWidth = ctx.measureText(text).width;
                        ctx.beginPath();
                        ctx.fillStyle = color;

                        if (el.showNumerals) {
                            ctx.fillText(text, nx-(textWidth / 2), ny);
                        }
                    } else {
                        // minute marker
                        ctx.lineWidth = parseInt(el.size / 100, 10);
                        sx = sang * (dialRadius - dialRadius / 20);
                        sy = cang * -(dialRadius - dialRadius / 20);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round";
                    ctx.moveTo(sx,sy);
                    ctx.lineTo(ex,ey);
                    ctx.stroke();
                }

                if (el.brandText !== undefined) {
                    ctx.font = '100 ' + parseInt(el.size / 14, 10) + 'px helvetica';
                    var brandtextWidth = ctx.measureText(el.brandText).width;
                    ctx.fillText(el.brandText, -brandtextWidth / 2, el.size / 6);
                }

                if (el.brandText2 !== undefined) {
                    ctx.textBaseline = 'middle';
                    ctx.font = '100 ' + parseInt(el.size / 18, 10) + 'px helvetica';
                    var brandtextWidth2 = ctx.measureText (el.brandText2).width;
                    ctx.fillText(el.brandText2,-(brandtextWidth2/2),(el.size/4));
                }

            }

            function drawHand(length) {
               ctx.beginPath();
               ctx.moveTo(0, 0);
               ctx.lineTo(0, -length);
               ctx.stroke();
            }

            function drawSecondHand(seconds, color) {
                var shlength = radius - (el.size / 40);

                ctx.save();
                ctx.lineWidth = parseInt(el.size / 150, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate(toRadians(seconds * 6));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size / 80, 10);
                ctx.shadowOffsetX = parseInt(el.size / 200, 10);
                ctx.shadowOffsetY = parseInt(el.size / 200, 10);

                drawHand(shlength);

                // second hand
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, shlength / 15);
                ctx.lineWidth = parseInt(el.size / 30, 10);
                ctx.stroke();

                // round center
                ctx.beginPath();
                ctx.arc(0, 0, parseInt(el.size/30,10), 0, 360, false);
                ctx.fillStyle = color;

                ctx.fill();
                ctx.restore();
            }

            function drawMinuteHand(minutes, color) {
                var mhlength = el.size / 2.2;
                ctx.save();
                ctx.lineWidth = parseInt(el.size / 50, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate(toRadians(minutes * 6));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size / 50, 10);
                ctx.shadowOffsetX = parseInt(el.size / 250, 10);
                ctx.shadowOffsetY = parseInt(el.size / 250, 10);

                drawHand(mhlength);
                ctx.restore();
            }

            function drawHourHand(hours, color) {
                var hhlength = el.size / 3;
                ctx.save();
                ctx.lineWidth = parseInt(el.size / 25, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate(toRadians(hours * 30));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size / 50, 10);
                ctx.shadowOffsetX = parseInt(el.size / 300, 10);
                ctx.shadowOffsetY = parseInt(el.size / 300, 10);

                drawHand(hhlength);
                ctx.restore();
            }

            function startClock(prevMeridiem, lastTick) {
                const sleepFencepost = 2000;
                const sleepInitial = Infinity;
                const delay = 1000;

                var theDate = luxon.DateTime.utc().setZone(el.timeZone);

                var delta = (lastTick === null) ? sleepInitial : (theDate - lastTick);
                var slept = delta >= sleepFencepost;

                var secs = theDate.second;
                var mins = theDate.minute;
                var hours = (theDate.hour % 12);

                var meridiem = (theDate.hour < 12) ? "AM" : "PM";
                var triggerMeridiemEvent = true;
                var triggerMinute = true;
                if (prevMeridiem !== null) {
                    triggerMeridiemEvent = (meridiem !== prevMeridiem);
                    triggerMinute = (secs == 0);
                }

                // trigger custom events
                $(el).trigger('everySecond', {date: theDate, clock: el});
                if (triggerMinute | slept) {
                    $(el).trigger('everyMinute', {date: theDate, clock: el});
                }
                if (triggerMeridiemEvent | slept) {
                    $(el).trigger('meridiemChange', {meridiem: meridiem, date: theDate, clock: el});
                }

                ctx.clearRect(-radius, -radius, el.size, el.size);

                drawDial(el.dialColor, el.dialBackgroundColor);

                drawHourHand(hours + (mins/60), el.hourHandColor);
                drawMinuteHand(mins + (secs/60), el.minuteHandColor);
                drawSecondHand(secs, el.secondHandColor);

                var synced_delay = delay - ((new Date().getTime()) % delay);
                setTimeout(function() {startClock(meridiem, theDate);}, synced_delay);
            }

            startClock(null, null);
   });
  };
}(jQuery));
