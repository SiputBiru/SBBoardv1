module.exports = {
  params: {
    designator: 'SW',
    side: 'B',
    reversible: false,
    include_silkscreen: true,
    // Nets
    from: undefined, // Connects to Pin 1
    to: undefined,   // Connects to Pin 2
    shield_net: undefined, // Optional: Connect side tabs to a net (e.g. GND)
  },
  body: p => {
    // Standard KiCad s-expression header
    // p.at handles the placement and rotation of the entire footprint
    const common_start = `
        (footprint "SW_Tact_TS-A002_Side"
            (layer "${p.side}.Cu")
            ${p.at} 
            (property "Reference" "${p.ref}"
                (at 0 -3 0)
                (layer "${p.side}.SilkS")
                ${p.ref_hide}
                (effects (font (size 1 1) (thickness 0.15)))
            )
            (attr smd)
        `;

    // Logic to handle "shield_net" if the user provided it, otherwise empty
    const shield_net_str = p.shield_net ? p.shield_net.str : "";

    // FRONT SIDE DEFINITIONS
    const pads_front = `
            ;; Pin 1 (Left, 2.3mm pitch -> -1.15)
            (pad "1" smd rect (at -1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from ? p.from.str : ''})
            
            ;; Pin 2 (Right, 2.3mm pitch -> 1.15)
            (pad "2" smd rect (at 1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to ? p.to.str : ''})
            
            ;; Side Tabs (Shields) - Mechanical strength
            (pad "SH" smd rect (at -3.5 0 ${p.r}) (size 1.2 2.2) (layers "F.Cu" "F.Paste" "F.Mask") ${shield_net_str})
            (pad "SH" smd rect (at 3.5 0 ${p.r}) (size 1.2 2.2) (layers "F.Cu" "F.Paste" "F.Mask") ${shield_net_str})
            
            ;; Plastic Locating Pegs (NPTH - Non Plated Through Hole)
            (pad "" np_thru_hole circle (at -2.1 0 ${p.r}) (size 0.7 0.7) (drill 0.7) (layers "*.Cu" "*.Mask"))
            (pad "" np_thru_hole circle (at 2.1 0 ${p.r}) (size 0.7 0.7) (drill 0.7) (layers "*.Cu" "*.Mask"))
        `;

    const silkscreen_front = `
            ;; Body Outline
            (fp_line (start -3.6 -1.85) (end 3.6 -1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start -3.6 1.85) (end -3.6 -1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start 3.6 1.85) (end 3.6 -1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start -3.6 1.85) (end 3.6 1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        `;

    // BACK SIDE DEFINITIONS
    // Note: For a side-switch, "Back" usually means placing it on the bottom layer.
    // We mirror the X coordinates if we want it to physically match the front view,
    // but standard KiCad "Back" placement just flips the view. 
    // We use "B.Cu" and identical local coordinates because the component itself flips.

    const pads_back = `
            (pad "1" smd rect (at -1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from ? p.from.str : ''})
            (pad "2" smd rect (at 1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.to ? p.to.str : ''})
            (pad "SH" smd rect (at -3.5 0 ${p.r}) (size 1.2 2.2) (layers "B.Cu" "B.Paste" "B.Mask") ${shield_net_str})
            (pad "SH" smd rect (at 3.5 0 ${p.r}) (size 1.2 2.2) (layers "B.Cu" "B.Paste" "B.Mask") ${shield_net_str})
            (pad "" np_thru_hole circle (at -2.1 0 ${p.r}) (size 0.7 0.7) (drill 0.7) (layers "*.Cu" "*.Mask"))
            (pad "" np_thru_hole circle (at 2.1 0 ${p.r}) (size 0.7 0.7) (drill 0.7) (layers "*.Cu" "*.Mask"))
        `;

    const silkscreen_back = `
            (fp_line (start -3.6 -1.85) (end 3.6 -1.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start -3.6 1.85) (end -3.6 -1.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start 3.6 1.85) (end 3.6 -1.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start -3.6 1.85) (end 3.6 1.85) (layer "B.SilkS") (stroke (width 0.12) (type solid)))
        `;

    const common_end = `)`;

    let final = common_start;

    if (p.side == "F" || p.reversible) {
      final += pads_front;
      if (p.include_silkscreen) final += silkscreen_front;
    }
    if (p.side == "B" || p.reversible) {
      final += pads_back;
      if (p.include_silkscreen) final += silkscreen_back;
    }

    final += common_end;
    return final;
  }
};
