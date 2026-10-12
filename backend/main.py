from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg
from psycopg.rows import dict_row

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    return psycopg.connect(
        "host=localhost dbname=tp1_crud user=tp1_user password=tp1pass123",
        row_factory=dict_row
    )


class Product(BaseModel):
    name: str
    description: str | None = None
    price: float
    quantity: int


@app.get("/")
def accueil():
    return {"message": "Bienvenue dans mon API CRUD !"}


@app.get("/products")
def list_products():
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM products ORDER BY id")
            return cur.fetchall()


@app.get("/products/{product_id}")
def get_product(product_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT * FROM products WHERE id = %s",
                (product_id,)
            )
            product = cur.fetchone()

            if product is None:
                raise HTTPException(
                    status_code=404,
                    detail="Produit introuvable"
                )

            return product


@app.post("/products")
def create_product(product: Product):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO products (name, description, price, quantity)
                VALUES (%s, %s, %s, %s)
                RETURNING *
                """,
                (
                    product.name,
                    product.description,
                    product.price,
                    product.quantity
                )
            )
            return cur.fetchone()


@app.put("/products/{product_id}")
def update_product(product_id: int, product: Product):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                UPDATE products
                SET name = %s, description = %s, price = %s, quantity = %s
                WHERE id = %s
                RETURNING *
                """,
                (
                    product.name,
                    product.description,
                    product.price,
                    product.quantity,
                    product_id
                )
            )
            updated = cur.fetchone()

            if updated is None:
                raise HTTPException(
                    status_code=404,
                    detail="Produit introuvable"
                )

            return updated


@app.delete("/products/{product_id}")
def delete_product(product_id: int):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM products WHERE id = %s RETURNING *",
                (product_id,)
            )
            deleted = cur.fetchone()

            if deleted is None:
                raise HTTPException(
                    status_code=404,
                    detail="Produit introuvable"
                )

            return {
                "message": "Produit supprimé",
                "product": deleted
            }
