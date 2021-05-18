uniform float u_time;
uniform float uSunAngle;

vec3 DayColor = vec3(0.2941, 0.2824, 0.9765);
vec3 NightColor = vec3(0.1412, 0.0, 0.3333);

void main() {
    vec3 color = vec3(0.0);

    float strength = abs(sin(uSunAngle));

    // Mix uses strength (a value from 0-1) to mix the two colors
    color = mix(DayColor, NightColor, strength);

    gl_FragColor = vec4(color,1.0);
}