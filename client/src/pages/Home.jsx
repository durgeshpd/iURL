import URLForm from "../components/URLForm";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">URL Shortener</h1>
      <URLForm />
    </div>
  );
};

export default Home;
