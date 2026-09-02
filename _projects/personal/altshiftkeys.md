---
title: altshiftkeys
github_repo: lederhilger/altshiftkeys
---

# <code>altshiftkeys</code>

I have a separate computer I use for computer programming than the one I use for my daily reading and writing.
A computer without needless software is better for tasks requiring more attention, I imagine.
And so this other computer is a Thinkpad T490 with a barebones installation of Arch Linux:

```bash
$ fastfetch
                  -`                     simon@T490-arch
                 .o+`                    ---------------
                `ooo/                    OS: Arch Linux x86_64
               `+oooo:                   Host: ThinkPad T490
              `+oooooo:                  Kernel: Linux 7.1.9-arch1-2
              -+oooooo+:                 Uptime: 2 mins
            `/:-:++oooo+:                Packages: x (pacman)
           `/++++/+++++++:               Shell: bash 5.3.15
          `/++++++++++++++:              Display: 1920x1080 in 14", 60 Hz [Built-in]
         `/+++ooooooooooooo/`            Terminal: /dev/tty1
        ./ooosssso++osssssso+`           Terminal Font: VGA default kernel font 8x16x256
       .oossssso-````/ossssss+`          CPU: Intel(R) Core(TM) i5-8265U (8) @ 3.90 GHz
      -osssssso.      :ssssssso.         GPU: Intel UHD Graphics 620 @ 1.10 GHz [Integrated]
     :osssssss/        osssso+++.        Memory: 867.87 MiB / 38.83 GiB (2%)
    /ossssssss/        +ssssooo/-        Swap: 0 B / 4.00 GiB (0%)
  `/ossssso+/:-        -:/+osssso+-      Disk (/): 14.33 GiB / 48.91 GiB (29%) - ext4
 `+sso+:-`                 `.-/+oso:     Disk (/home): 5.91 GiB / 865.61 GiB (1%) - ext4
`++:.                           `-/+/    Battery: 99% [Discharging]
.`                                 `/    Locale: en_US.UTF-8                                         
```

I do have $\LaTeX$ installed for some reason, but I ought to get rid of it, as I don't have a display server on the computer.
That is, the entire graphical user interface is a black terminal with white text.
Nevermind that, for the issue that led me to create the <code>altshiftkeys</code> repository is something entirely different.

I use Emacs for writing code, which, for those unfamiliar with the text editing software, is an acronym for *editor macros*.
As the name suggests, it uses macros, or keybindings, to navigate and edit text.
As you can see from the `fastfetch` above, my locale is US English, meaning that the system displays English text.
My computer, however, has a Norwegian keyboard layout:

```bash
$ localectl status
System Locale: LANG=en_US.UTF-8
    VC Keymap: no
   X11 Layout: (unset)
```

The `VC Keymap` parameter here means virtual console keymap, corresponding to the teletypewriter (`/dev/tty1`) terminal.