uniform float uSunAngle;

vec3 DayColor = vec3(0.2941, 0.2824, 0.9765);
vec3 NightColor = vec3(0.051, 0.0, 0.1216);

void main() {
    vec3 color = vec3(0.0);

    float strength = abs(sin(uSunAngle));

    color = mix(DayColor, NightColor, strength);

    gl_FragColor = vec4(color,1.0);
}