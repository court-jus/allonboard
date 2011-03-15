// All On Board
// Created January 17, 2011 9:17:39 PM
// Copyright (c) 2011 Ghislain Leveque

function mapIndexToMapCoord(i)
	{
	return MAP[i];
	}
function mapIndexToScreenX(mi, dot)
	{
	return mapCoordToScreenX(mapIndexToMapCoord(mi)[0], dot);
	}
function mapIndexToScreenY(mi, dot)
	{
	return mapCoordToScreenY(mapIndexToMapCoord(mi)[1], dot);
	}
function mapIndexToScreenCoord(mi)
	{
	var mapcoord = mapIndexToMapCoord(mi);
	return mapCoordToScreenCoord(mapcoord[0], mapcoord[1]);
	}
function mapCoordToScreenX(mx, dot)
	{
	if (mx == -1) return LAUNCH_POSITION.x + Math.floor(Math.random() * 50) - 25;
	if (mx == -10) return LANDHERE_POSITION.x + Math.floor(Math.random() * 50) - 25;
	return mx*TILE_WIDTH + MAP_X_OFFSET;
	}
function mapCoordToScreenY(my, dot)
	{
	if (my == -1)
        {
        if (dot) return LAUNCH_POSITION.y + Math.floor(Math.random() * 50) - 25 + dot.color * 100;
        return LAUNCH_POSITION.y + Math.floor(Math.random() * 50) - 25;
        }
	if (my == -10)
        {
        if (dot) return LANDHERE_POSITION.y + Math.floor(Math.random() * 50) - 25 + dot.color * 100;
        return LANDHERE_POSITION.y + Math.floor(Math.random() * 50) - 25;
        }
	return my*TILE_HEIGHT + MAP_Y_OFFSET;
	}
function mapCoordToScreenCoord(mx, my)
	{
	return [mapCoordToScreenX(mx), mapCoordToScreenY(my)];
	}
function shuffle(o)
    {
	for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
    }

function makeWeightFromArray(a)
    {
    return {
            rewind_distance             : a[0],
            rewind_advanced             : a[1],
            pickup_two                  : a[2],
            pickup_when_low_on_cards    : a[3],
            rewind_early                : a[4],
            forward_distance            : a[5],
            forward_late_peons          : a[6],
            prefer_rewind               : a[7]
        };
    }
