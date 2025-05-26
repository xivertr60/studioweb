using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
[RequireComponent(typeof(Animator))]
public class PlayerController : MonoBehaviour
{
    [Header("Movimiento")]
    public float walkSpeed = 3.0f;
    public float runSpeed = 6.0f;
    public float jumpForce = 6.0f;

    [Header("Atributos")]
    public int health = 100;
    public int money = 0;

    private Rigidbody rb;
    private Animator anim;
    private bool isRunning = false;
    private bool isGrounded = true;

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        anim = GetComponent<Animator>();
    }

    void Update()
    {
        float moveX = Input.GetAxis("Horizontal");
        float moveZ = Input.GetAxis("Vertical");

        isRunning = Input.GetKey(KeyCode.LeftShift);
        float speed = isRunning ? runSpeed : walkSpeed;

        Vector3 move = transform.right * moveX + transform.forward * moveZ;
        Vector3 velocity = move * speed;
        velocity.y = rb.velocity.y;
        rb.velocity = velocity;

        // Animaciones
        anim.SetFloat("Speed", move.magnitude * (isRunning ? 2f : 1f));
        anim.SetBool("isRunning", isRunning);

        // Saltar
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.AddForce(Vector3.up * jumpForce, ForceMode.Impulse);
            anim.SetTrigger("Jump");
            isGrounded = false;
        }

        // Atacar
        if (Input.GetButtonDown("Fire1"))
        {
            anim.SetTrigger("Attack");
        }
    }

    private void OnCollisionEnter(Collision collision)
    {
        if (collision.gameObject.CompareTag("Ground"))
        {
            isGrounded = true;
        }
    }

    // Métodos para vida, dinero, etc.
    public void TakeDamage(int damage)
    {
        health -= damage;
        if (health <= 0)
        {
            anim.SetTrigger("Die");
            // Aquí puedes añadir respawn o game over
        }
    }

    public void AddMoney(int amount)
    {
        money += amount;
    }
}
import { createBetterCar } from './betterCar.js';

const car = createBetterCar();
car.position.set(5, 0, 0); // Ajusta la posición inicial
scene.add(car);
