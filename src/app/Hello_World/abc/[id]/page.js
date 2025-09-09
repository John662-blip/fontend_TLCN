export default async function ProductPage({ params }) {
  const { id } = await params;  // ⬅ cần await

  return (
    <div>
      <h1>Chi tiết sản phẩm</h1>
      <p>ID sản phẩm: {id}</p>
    </div>
  );
}
