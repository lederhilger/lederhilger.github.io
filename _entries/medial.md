---
title: Medial axis
date: 2026-05-18
---

# Medial axis

The airfoils you find on the internet are often polygons, which I saw as an obstacle when I wrote my master's thesis on the the vortex lattice method, applied to wind turbines.
For this method, you discretize the blades of the wind turbine into flat lifting surfaces, using the mean camber line as the basis for the resulting panels.
The vortex lattice method isn't really concerned with the displacement of the air flowing past it due to the physical thickness of the blades themselves, so this approximation of the blades as panels is fine.
The problem I was faced with was how I was supposed to extract the mean camber line from the finite number of points provided to me by some `dat`-file I found online.
You see, for my bachelor's thesis, I was told to use the SD7032 profile as the exemplary airfoil on which to base my analysis.
This airfoil is only found as a collection of sixty or so points that define a polygon that approximates it.<sup><a href="#ref-selig1989airfoils">1</a></sup>

For my thesis, I was reading many of the papers of John <span class="smallcaps">Hess</span> and Apollo <span class="smallcaps">Smith</span>, a paper of the former suggesting what would inspire me to pursue this topic, even though it wasn't really relevant to its main research question.
This paper of <span class="smallcaps">Hess</span>', and pretty much all his papers on the topic, pertained to the representation of the wing in full for the displacement solution, but with a very similar construction of bound vorticity on the mean camber line.<sup><a href="#ref-hess1974problem-2">2</a></sup>
He suggests that an airfoil given as an equal distribution of points on the pressure and suction sides of the airfoil would yield pairwise vertices by which one could find a linear interpolation of the mean camber line through the midpoints of the lines connecting them, the leading and trailing edge vertices notwithstanding.
Although I try to craft my writing such that one may understand what I'm talking about just by reading my text, I understand that it may be cumbersome, so here's a picture:

### Notes

<ol class="notes">
    <li id="note-selig1989airfoils-1">
	Coördinates are found on page 122 in <a href="#selig1989airfoils"><span class="smallcaps">Selig</span> <em>et al.</em> (1989)</a>.
	<a href="#ref-selig1989airfoils-1"></a>
    </li>
    <li id="note-hess1974problem-2">
    	See figure 7a in <a href="#hess1974problem"><span class="smallcaps">Hess</span> (1974).</a>
    </li>
</ol>

## Bibliography

<p id="hess1974problem">
   John L. Hess, <em>The Problem of Three-dimensional Lifting Potential Flow and its Solution by Means of Surface Singularity Distribution</em>, Computer Methods in Applied Mechanics and Engineering, 4 (1974), pp.283–319
</p>

<p id="li1982medial">
   Decai <span class="smallcaps">Li</span> (李德財), <em>Medial Axis Transformation of a Planar Shape</em>, IEEE Transactions on Pattern Analysis and Machine Intelligence, PAMI-4 (1982)
</p>

<p id="selig1989airfoils">
   Michael S. <span class="smallcaps">Selig</span>, John F. <span class="smallcaps">Donovan</span>, & David B. <span class="smallcaps">Fraser</span>, <em>Airfoils at Low Speeds</em>, 1989 by H. A. Stoakley, publisher
</p>