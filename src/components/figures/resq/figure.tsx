import { buildings, DIGIT_TRANSFORMS, droneParts, ground, pads, ROTOR_R, ROTOR_Z, ROTORS, rotorRims } from "./art";
import ResQLive from "./live";
import { CENTERS, CRUISE_MS, km, METERS_PER_UNIT, readoutOf } from "./model";
import "../../iso/iso.css";
import "./resq.css";

const LABEL =
  "An isometric model of a fire-season map on a plate. A fire station with a hose tower sits at the back left beside its landing pad. Three relief centers stand around the map, each with its own pad, and a ZIP counter at the front shows the request. A quadcopter with a GPS puck carries a crate from the station to the center whose ZIP matches, sets it down and flies home.";

// Static art is built here on the server; the client only moves the drone and redraws the route.
export default function ResQFigure() {
  const far = CENTERS.reduce((a, c) => (km(c) > km(a) ? c : a));
  return (
    <figure className="iso iso-figure resq">
      <div className="iso-plate">
        <div className="iso-plate-corners" aria-hidden="true">
          <span className="iso-plate-corner" data-corner="fig">
            Fig. 1
          </span>
          <span className="iso-plate-corner" data-corner="title">
            ZIP to pad
          </span>
          <span className="iso-plate-corner" data-corner="hint">
            Pick a center or press ← →
          </span>
          <span className="iso-plate-corner" data-corner="readout" data-readout="">
            {readoutOf(CENTERS[0], "matched")}
          </span>
        </div>
        <ResQLive
          label={LABEL}
          ground={ground()}
          pads={pads()}
          buildings={buildings()}
          drone={droneParts()}
          rims={rotorRims()}
          digits={DIGIT_TRANSFORMS}
          rotors={ROTORS}
          rotorZ={ROTOR_Z}
          rotorR={ROTOR_R}
        />
      </div>
      <figcaption className="iso-legend">
        <span className="iso-keys">
          <span className="iso-key">
            <svg className="iso-swatch" data-mark="lit" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M2 4.5 8 1.5 14 4.5 14 6 8 9 2 6Z" />
            </svg>
            GPS puck and the route it flies
          </span>
          <span className="iso-key">
            <svg className="iso-swatch" data-mark="red" viewBox="0 0 16 10" aria-hidden="true">
              <path d="M1.5 5h13" />
            </svg>
            Aid: the crate and the relief crosses
          </span>
        </span>
        <span className="iso-caption">
          A model, not a survey: one map unit is {METERS_PER_UNIT} m and the drone cruises at {CRUISE_MS} m/s, so the farthest
          center, {far.zip}, is {km(far).toFixed(1)} km out. Flights are sped up. The match is the real idea: a request carries a ZIP, and
          the drone lands on the pad of the center that owns it.
        </span>
      </figcaption>
    </figure>
  );
}
