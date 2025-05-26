using UnityEngine;

public class DayNightCycle : MonoBehaviour
{
    [Header("Sol")]
    public Light sun;
    public float dayDuration = 120f; // Segundos para un día completo
    public Gradient sunColorOverDay;
    public AnimationCurve sunIntensityOverDay;

    [Header("Skybox")]
    public Material skyboxMaterial;
    public Gradient skyColorOverDay;

    [HideInInspector]
    public float timeOfDay = 0f; // 0-1 (0: medianoche, 0.5: mediodía, 1: medianoche)

    void Update()
    {
        timeOfDay += Time.deltaTime / dayDuration;
        if (timeOfDay > 1f) timeOfDay -= 1f;

        // Rotación del sol
        float sunAngle = timeOfDay * 360f - 90f;
        sun.transform.rotation = Quaternion.Euler(sunAngle, 170f, 0);

        // Color e intensidad del sol
        sun.color = sunColorOverDay.Evaluate(timeOfDay);
        sun.intensity = sunIntensityOverDay.Evaluate(timeOfDay);

        // Color del cielo (skybox procedural)
        if (skyboxMaterial != null)
        {
            skyboxMaterial.SetColor("_SkyTint", skyColorOverDay.Evaluate(timeOfDay));
        }
    }
}
