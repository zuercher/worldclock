const clockGroups = [
    {
        name: '',
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
        name: 'NASA',
        code: 'nasa',
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
                name: 'Montréal',
                region: 'ca-central-1',
                code: 'yul',
                tz: 'America/Toronto'
            },
            {
                name: 'São Paulo',
                region: 'sa-east-1',
                code: 'gru',
                tz: 'America/Sao_Paulo',
                newcol: true
            }
        ]
    },
    {
        name: 'EMEA',
        code: 'emea',
        clocks: [
            {
                name: 'Dublin',
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
                name: 'Paris',
                region: 'eu-west-3',
                code: 'cdg',
                tz: 'Europe/Paris'
            },
            {
                name: 'Frankfurt',
                region: 'eu-central-1',
                code: 'fra',
                tz: 'Europe/Berlin',
                newcol: true,
            },
            {
                name: 'Cape Town',
                region: 'af-south-1',
                code: 'cpt',
                tz: 'Africa/Johannesburg'
            }
        ]
    },
    {
        name: 'APAC',
        code: 'apac',
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
            },
            {
                name: 'Sydney',
                region: 'ap-southeast-2',
                code: 'syd',
                tz: 'Australia/Sydney',
                newcol: true
            }
        ]
    }
];

function renderClocks(id) {
    all = $(id);
    table = $('<table class="clockstbl"></table>');
    row = $('<tr></tr>');
    table.append(row);
    all.append(table);

    clockGroups.forEach(function(group) {
        groupId = group.code;

        numCols = 1;
        group.clocks.forEach(function(clockDef) {
            if (clockDef.newcol) {
                numCols++;
            }
        });

        groupNameDiv = $('<div class="groupname">' + group.name + '</div>');

        cell = $('<th colspan=' + numCols + '></th>');
        cell.append(groupNameDiv);

        row.append(cell);
    });

    row = $('<tr></tr>');
    table.append(row);

    clockGroups.forEach(function(group) {
        mkNewCol = function(inner) {
            clocksDiv = $('<div class="clocks"></div>');

            var cell;
            if (inner) {
                cell = $('<td class="inner"></td>');
            } else {
                cell = $('<td></td>');
            }
            cell.append(clocksDiv);

            row.append(cell);

            return clocksDiv;
        };

        clocksDiv = mkNewCol(false);

        group.clocks.forEach(function(clockDef) {
            clockId = clockDef.code;

            nameDiv = $('<div class="name">' + clockDef.name + '</div>');
            clockDiv = $('<div></div>').attr('id', clockId);
            apDiv = $('<div class="meridiem">--</div>').attr('id', clockId + '_ampm');

            div = $('<div></div>').attr('class', 'clock');
            div.append(nameDiv, clockDiv, apDiv);

            if (clockDef.newcol) {
                clocksDiv = mkNewCol(true);
            }
            clocksDiv.append(div);

            $('#' + clockId).on('everySecond', function(e, d) {
                $('#' + d.clock.id + '_ampm').text(d.date.hour < 12 ? "AM" : "PM");
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

            $('#' + clockId).thooClock({
                id: clockId,
                size: 200,
                brandText: clockDef.region,
                brandText2: code,
                timeZone: clockDef.tz
            });
        });

    });

/*
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
            clockDiv = $('<div></div>').attr('id', clockId);
            apDiv = $('<div class="meridiem">--</div>').attr('id', clockId + '_ampm');

            div = $('<div></div>').attr('class', 'clock');
            div.append(nameDiv, clockDiv, apDiv);

            clocksDiv.append(div);

            $('#' + clockId).on('everySecond', function(e, d) {
                $('#' + d.clock.id + '_ampm').text(d.date.hour < 12 ? "AM" : "PM");
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

            $('#' + clockId).thooClock({
                id: clockId,
                size: 200,
                brandText: clockDef.region,
                brandText2: code,
                timeZone: clockDef.tz
            });
        });
    });
*/
};
