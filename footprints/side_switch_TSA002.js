module.exports = {
  params: {
    designator: 'SW',
    side: 'B',
    reversible: false,
    include_silkscreen: true,
    // Nets
    from: undefined, // Connects to Pin 1 AND the Shield
    to: undefined,   // Connects to Pin 2
  },
  body: p => {
    // Standard KiCad s-expression header
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

    // FRONT SIDE DEFINITIONS
    const pads_front = `
            ;; Pin 1 (Left) - Connected to 'from' Net
            (pad "1" smd rect (at -1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
            
            ;; Pin 2 (Right) - Connected to 'to' Net
            (pad "2" smd rect (at 1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "F.Cu" "F.Paste" "F.Mask") ${p.to.str})
            
            ;; Side Tabs (Shields) - Connects to 'from' Net (usually GND)
            (pad "SH" smd rect (at -3.5 0 ${p.r}) (size 1.2 2.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
            (pad "SH" smd rect (at 3.5 0 ${p.r}) (size 1.2 2.2) (layers "F.Cu" "F.Paste" "F.Mask") ${p.from.str})
            
            ;; Plastic Locating Pegs
            (pad "" np_thru_hole circle (at -2.1 0 ${p.r}) (size 0.7 0.7) (drill 0.7) (layers "*.Cu" "*.Mask"))
            (pad "" np_thru_hole circle (at 2.1 0 ${p.r}) (size 0.7 0.7) (drill 0.7) (layers "*.Cu" "*.Mask"))
        `;

    const silkscreen_front = `
            (fp_line (start -3.6 -1.85) (end 3.6 -1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start -3.6 1.85) (end -3.6 -1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start 3.6 1.85) (end 3.6 -1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
            (fp_line (start -3.6 1.85) (end 3.6 1.85) (layer "F.SilkS") (stroke (width 0.12) (type solid)))
        `;

    // BACK SIDE DEFINITIONS
    const pads_back = `
            (pad "1" smd rect (at -1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
            (pad "2" smd rect (at 1.15 1.25 ${p.r}) (size 1.0 1.5) (layers "B.Cu" "B.Paste" "B.Mask") ${p.to.str})
            (pad "SH" smd rect (at -3.5 0 ${p.r}) (size 1.2 2.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
            (pad "SH" smd rect (at 3.5 0 ${p.r}) (size 1.2 2.2) (layers "B.Cu" "B.Paste" "B.Mask") ${p.from.str})
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