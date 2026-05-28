---
title: The failure of the medial axis
date: 2026-05-18
---

# The failure of the medial axis

The airfoils you find on the internet are often polygons, which I saw as an obstacle when I wrote my master's thesis on the the vortex lattice method, applied to wind turbines.
For this method, you discretize the blades of the wind turbine into flat lifting surfaces, using the mean camber line as the basis for the resulting panels.
The vortex lattice method isn't really concerned with the displacement of the air flowing past it due to the physical thickness of the blades themselves, so this approximation of the blades as panels is fine.
The problem I was faced with was how I was supposed to extract the mean camber line from the finite number of points provided to me by some `dat`-file I found online.
You see, for my bachelor's thesis, I was told to use the SD7032 profile as the exemplary airfoil on which to base my analysis.
This airfoil is only found as a collection of sixty or so points that define a polygon that approximates it.<sup><a href="#ref-selig1989airfoils">1</a></sup>

For my thesis, I was reading many of the papers of John <span class="smallcaps">Hess</span> and Apollo <span class="smallcaps">Smith</span>, a paper of the former suggesting what would inspire me to pursue this topic, even though it wasn't really relevant to its main research question.
This paper of <span class="smallcaps">Hess</span>'s, and pretty much all his papers on the topic, pertained to the representation of the wing in full for the displacement solution, but with a very similar construction of bound vorticity on the mean camber line.<sup><a href="#ref-hess1974problem-2">2</a></sup>
He suggests that an airfoil given as an equal distribution of points on the pressure and suction sides of the airfoil would yield pairwise vertices by which one could find a linear interpolation of the mean camber line through the midpoints of the lines connecting them, the leading and trailing edge vertices notwithstanding.
Although I try to craft my writing such that one may understand what I'm talking about just by reading my text, I understand that it may be cumbersome, so here's a picture:

<img class="entry-figure" src="{{ '/assets/entries/medial/hess_camber.svg' | relative_url }}" alt="Hess's suggestion for mean camber approximation">

This is obviously a very bad approximation of the mean camber line.
My first thought was that this isn't very good for the sole reason that the SD7032 profile doesn't actually have an equal number of points on the suction side as on the pressure side.
What I did to construct this figure was choosing a somewhat coherent collection of points on the suction side, and then try to match those points in abscissal value from among the pressure side points to the best of my ability.
To address this issue, I though you could use a sort of first order approximation in the sense that you can draw a straight line from each vertex to the ordinately opposite side of the polygon, and construct the mean camber approximation in a similar manner to <span class="smallcaps">Hess</span>.
My second thought was that this could obviously be done much better with splines, and so I went to speak with <a href="https://mn.uio.no/math/english/people/aca/michaelf/">Mike</a>, whom I reckoned to know a thing or two about such things.
Drawing my polygonal airfoil on the blackboard in his office, he said something along the lines of "This sounds like the medial axis."
And so, on this medial axis tangent I went on workdays during which I ought to have been preöccupied with implementing the fast multipole method to my vortex lattice solver.

My search for literature swiftly brought me before the paper titled <em>Medial Axis Transformation of a Planar Shape</em> by Decai <span class="smallcaps">Li</span>,<sup><a href="">3</a></sup> and with it came my formal introduction to the <em><span class="smallcaps">Voronoj</span> diagram</em>, something I had heard of in passing before.
It turns out the medial axis is a subset thereof, you just have to remove the edges that terminate at a reflex vertex.
I won't recite <span class="smallcaps">Li</span>'s entire article here, but I will provide the broad strokes, and although I did implement his algorithm, I'll present a simpler, more digestible algorithm involving quadtree partitioning.

<div id="delone-controls">
     <label><input type="checkbox" data-layer="regions">regions</label>
     <label><input type="checkbox" data-layer="voronoj"><span class="smallcaps">Voronoj</span></label>
     <label><input type="checkbox" data-layer="medial">medial</label>
     <label><input type="range" id="delone-spacing" min="2" max="12" value="3">spacing</label>
     <button type="button" id="delone-reset">reset</button>
</div>
<canvas id="delone-canvas" width="460" height="500"></canvas>
<script type="module" src="{{ '/assets/js/medial/delone.js' | relative_url }}"></script>

Airfoil example.
<canvas id="airfoil-canvas" width="500" height="180"></canvas>
<script type="module" src="{{ '/assets/js/medial/airfoil.js' | relative_url }}"></script>
<div id="airfoil-controls">
     <label><input type="range" id="airfoil-points" min="4" max="60" step="4" value="16">points</label>
</div>

### Notes

<ol class="notes">
    <li id="note-selig1989airfoils-1">
	Coördinates are found on page 122 in <a href="#selig1989airfoils"><span class="smallcaps">Selig</span> <em>et al.</em> (1989)</a>.
	<a href="#ref-selig1989airfoils-1"></a>
    </li>
    <li id="note-hess1974problem-2">
    	See figure 7a in <a href="#hess1974problem"><span class="smallcaps">Hess</span> (1974).</a>
    </li>
    <li id="note-li1982medial">
	Although his name is often rendered Der-Tsai <span class="smallcaps">Lee</span>, I prefer to transliterate names consistently using modern standards, so I have cited him based on the pinyin of the Chinese 李德財, which is Décái Lǐ. Whence <a href="#li1982medial"><span class="smallcaps">Li</span> (1982)</a>.
    </li>
</ol>

## Bibliography

<p id="hess1974problem">
   John L. <span class="smallcaps">Hess</span>, <em>The Problem of Three-dimensional Lifting Potential Flow and its Solution by Means of Surface Singularity Distribution</em>, Computer Methods in Applied Mechanics and Engineering, 4 (1974), pp.283–319
</p>

<p id="li1982medial">
   Decai <span class="smallcaps">Li</span> (李德財), <em>Medial Axis Transformation of a Planar Shape</em>, IEEE Transactions on Pattern Analysis and Machine Intelligence, PAMI-4 (1982), pp.363–369
</p>

<p id="selig1989airfoils">
   Michael S. <span class="smallcaps">Selig</span>, John F. <span class="smallcaps">Donovan</span>, & David B. <span class="smallcaps">Fraser</span>, <em>Airfoils at Low Speeds</em>, 1989 by H. A. Stoakley, publisher
</p>