const clockGroups = [
    {
        name: '&nbsp;',
        code: 'local',
        clocks: [
            {
                name: 'Local',
                tz: 'local',
                code: 'xxxlocal'
            },
            {
                name: 'UTC',
                tz: 'utc',
                code: 'xxxutc'
            }
        ]
    },
    {
        name: 'Americas',
        code: 'americas',
        clocks: [
            {
                name: 'Portland',
                region: 'us-west-2',
                code: 'pdx',
                tz: 'America/Los_Angeles'
            },
            {
                name: 'Northern Virginia',
                region: 'us-east-1',
                code: 'iad',
                tz: 'America/New_York'
            },
            {
                name: 'São Paulo',
                region: 'sa-east-1',
                code: 'gru',
                tz: 'America/Sao_Paulo'
            }
        ]
    },
    {
        name: 'Europe',
        code: 'europe',
        clocks: [
            {
                name: 'Ireland',
                region: 'eu-west-1',
                code: 'dub',
                tz: 'Europe/Dublin'
            },
            {
                name: 'London',
                region: 'eu-west-2',
                code: 'lhr',
                tz: 'Europe/London'
            },
            {
                name: 'Frankfurt',
                region: 'eu-central-1',
                code: 'fra',
                tz: 'Europe/Berlin'
            }
        ]
    },
    {
        name: 'Asia-Pacific',
        code: 'ap',
        clocks: [
            {
                name: 'Mumbai',
                region: 'ap-south-1',
                code: 'bom',
                tz: 'Asia/Kolkata'
            },
            {
                name: 'Singapore',
                region: 'ap-southeast-1',
                code: 'sin',
                tz: 'Asia/Singapore'
            },
            {
                name: 'Tokyo',
                region: 'ap-northeast-1',
                code: 'nrt',
                tz: 'Asia/Tokyo'
            }
        ]
    },
    {
        name: 'Australia',
        code: 'aus',
        clocks: [
            {
                name: 'Sydney',
                region: 'ap-southeast-2',
                code: 'syd',
                tz: 'Australia/Sydney'
            }
        ]
    }
];

function renderClocks(id) {
    all = $(id);
    clockGroups.forEach(function(group) {
        groupId = group.code;

        groupNameDiv = $('<div class="groupname">' + group.name + '</div>');
        clocksDiv = $('<div class="clocks"></div>');

        groupDiv = $('<div class="group"></div>').attr('id', groupId);
        groupDiv.append(groupNameDiv, clocksDiv);

        if (!all.is(':empty')) {
            all.append($('<div class=divider></div>'));
        }
        all.append(groupDiv);

        group.clocks.forEach(function(clockDef) {
            clockId = clockDef.code;

            nameDiv = $('<div class="name">' + clockDef.name + '</div>');
            clockDiv = $('<div></div>').attr('id', clockId)
            apDiv = $('<div class="meridiem">--</div>').attr('id', clockId + '_ampm');

            div = $('<div></div>').attr('class', 'clock');
            div.append(nameDiv, clockDiv, apDiv);

            clocksDiv.append(div)

            clockId = '#' + clockId;
            $(clockId).on('meridiemChange', function(e, d) {
                $(clockId + '_ampm').text(d.meridiem);
            });

            $(clockId).on('everyMinute', function(e, d) {
                if (d.date.hour >= 6 && d.date.hour < 18) {
                    d.clock.dialColor = '#000000';
                    d.clock.dialBackgroundColor = 'transparent';
                    d.clock.minuteHandColor = '#222222';
                    d.clock.hourHandColor = '#222222';
                } else {
                    d.clock.dialColor = '#ffffff';
                    d.clock.dialBackgroundColor = '#000000';
                    d.clock.minuteHandColor = '#cccccc';
                    d.clock.hourHandColor = '#cccccc';
                }
            });

            code = clockDef.code;
            if (code[0] == 'x') {
                code = '';
            }

            $(clockId).thooClock({
                size: 200,
                brandText: clockDef.region,
                brandText2: code,
                timeZone: clockDef.tz
            });
        });
    });
};
