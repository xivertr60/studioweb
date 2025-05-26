using UnityEngine;

public enum WeatherType { Clear, Cloudy, Rain, Storm }

public class WeatherCycle : MonoBehaviour
{
    public DayNightCycle dayNightCycle; // Referencia al controlador del día/noche
    public ParticleSystem rainParticles;
    public Light sun;
    public Material skyboxMaterial;

    [Header("Config")]
    public float weatherChangeInterval = 60f; // Cambia cada X segundos
    private float timer = 0f;

    private WeatherType currentWeather = WeatherType.Clear;

    void Start()
    {
        SetWeather(WeatherType.Clear);
    }

    void Update()
    {
        timer += Time.deltaTime;
        if (timer > weatherChangeInterval)
        {
            timer = 0f;
            WeatherType next = (WeatherType)Random.Range(0, 4); // Cambia aleatorio
            SetWeather(next);
        }
    }

    void SetWeather(WeatherType weather)
    {
        currentWeather = weather;

        switch (weather)
        {
            case WeatherType.Clear:
                sun.intensity = dayNightCycle.sunIntensityOverDay.Evaluate(dayNightCycle.timeOfDay);
                if (rainParticles != null) rainParticles.Stop();
                skyboxMaterial.SetFloat("_AtmosphereThickness", 0.4f);
                break;
            case WeatherType.Cloudy:
                sun.intensity *= 0.7f;
                if (rainParticles != null) rainParticles.Stop();
                skyboxMaterial.SetFloat("_AtmosphereThickness", 0.8f);
                break;
            case WeatherType.Rain:
                sun.intensity *= 0.5f;
                if (rainParticles != null) rainParticles.Play();
                skyboxMaterial.SetFloat("_AtmosphereThickness", 1.2f);
                break;
            case WeatherType.Storm:
                sun.intensity *= 0.3f;
                if (rainParticles != null) rainParticles.Play();
                skyboxMaterial.SetFloat("_AtmosphereThickness", 1.5f);
                // Aquí puedes agregar rayos, truenos, viento fuerte, etc.
                break;
        }
    }
}
