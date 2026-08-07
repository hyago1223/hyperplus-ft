import { useState } from "react";
import { searchSeries, deleteSeries, uploadSerieImage, setSeriesAsHero, createSerie } from "@/service/fetch";
import styles from '@/components/css/admin/styles.module.css';

const FormDataSerie = {
  title: "",
  description: "",
  access_type: "",
}

export default function Serie() {
  const [serie, setSerie] = useState(null);
  const [res, setRes] = useState([]);
  const [windows, setWindows] = useState("");
  const [name, setname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearchSeries = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchSeries(name);
      setRes(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Erro ao buscar séries:", error);
      alert("Erro ao buscar séries");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSerie = async (selectedSerie) => {
    setSerie(selectedSerie);
    setWindows("");
  };

  const handleUploadSerieImage = async (e) => {
    e.preventDefault();
    if (!serie?.id) return alert('Selecione uma série primeiro');
    
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files[0];
    
    if (!file) return alert('Selecione um arquivo');
    
    try {
      setLoading(true);
      await uploadSerieImage(serie.id, file);
      alert('Imagem enviada com sucesso!');
      e.target.reset();
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro ao enviar imagem: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSerie = async () => {
    if (!serie?.id) return alert('Selecione uma série');
    
    const confirm = window.confirm(`Deletar série "${serie.title}"?`);
    if (!confirm) return;
    
    try {
      setLoading(true);
      await deleteSeries(serie.id);
      alert('Série deletada com sucesso!');
      setSerie(null);
      setRes([]);
      setWindows("");
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro ao deletar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetHero = async () => {
    if (!serie?.id) return alert('Selecione uma série');
    
    try {
      setLoading(true);
      await setSeriesAsHero(serie.id);
      alert('Série definida como hero!');
    } catch (error) {
      console.error("Erro:", error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Gerenciar Séries</h2>
      
      <form onSubmit={handleSearchSeries} className={styles.searchForm}>
        <input 
          type='text' 
          value={name} 
          placeholder='Nome da série' 
          onChange={(e) => setname(e.target.value)} 
          className={styles.searchInput}
        />
        <button type='submit' disabled={loading} className={styles.submitButton}>
          {loading ? 'Buscando...' : 'Pesquisar'}
        </button>
      </form>

      <form onSubmit={createSerie} className={styles.createForm}>
        <input 
          type='text'
          value={FormDataSerie.title}
          placeholder='Título da série'
          onChange={(e) => setFormDataSerie({ ...FormDataSerie, title: e.target.value })}
          className={styles.createInput}
        />
        <input 
          type='text'
          value={FormDataSerie.description}
          placeholder='Descrição da série'
          onChange={(e) => setFormDataSerie({ ...FormDataSerie, description: e.target.value })}
          className={styles.createInput}
        />
        <select
          value={FormDataSerie.access_type}
          onChange={(e) => setFormDataSerie({ ...FormDataSerie, access_type: e.target.value })}
          className={styles.createSelect}
        >
          <option value="">Tipo de acesso</option>
          <option value="free">Gratuito</option>
          <option value="premium">Premium</option>
        </select>
        <button type='submit' disabled={loading} className={styles.submitButton}>
          {loading ? 'Criando...' : 'Criar Série'}
        </button>
      </form>

      {res.length > 0 && (
        <div className={styles.episodesList}>
          <h4>Séries encontradas:</h4>
          {res.map((s) => (
            <div 
              key={s.id} 
              onClick={() => handleSelectSerie(s)}
              className={`${styles.episodeItem} ${serie?.id === s.id ? styles.episodeItemSelected : ''}`}
            >
              {s.title}
            </div>
          ))}
        </div>
      )}

      {serie && (
        <div className={styles.episodeDetails}>
          <h3>{serie.title}</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setWindows("upload")} className={styles.episodeDetailsButton} disabled={loading}>
              📤 Upload de Imagem
            </button>
            <button onClick={handleSetHero} className={styles.episodeDetailsButton} disabled={loading}>
              ⭐ Definir como Hero
            </button>
            <button onClick={handleDeleteSerie} className={styles.episodeDetailsButton} disabled={loading}>
              🗑️ Deletar Série
            </button>
          </div>

          {windows === "upload" && (
            <form onSubmit={handleUploadSerieImage} className={styles.uploadForm}>
              <input type="file" accept="image/*" className={styles.uploadInput} required />
              <button type="submit" disabled={loading} className={styles.uploadButton}>
                {loading ? 'Enviando...' : 'Enviar Imagem'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}