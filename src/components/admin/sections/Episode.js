import { useState } from "react";
import { envs as env } from "@/lib/env";
import styles from '@/components/css/admin/styles.module.css';
import { Form, EpisodeForm } from '../form.js';
import { searchSeries, loadEpisodesBySerieId, createEpisode, updateEpisode, deleteEpisode, uploadEpisodeVideo, uploadEpisodeMetadata } from '@/service/fetch';

const initialFormData = {
  title: "",
  description: "",
  episodeNumber: "",
  seasonNumber: "",
  duration: "",
  releaseDate: "",
};

const parseEpisodeData = (data) => ({
  ...data,
  episodeNumber: data.episodeNumber ? Number(data.episodeNumber) : null,
  seasonNumber: data.seasonNumber ? Number(data.seasonNumber) : null,
  releaseDate: data.releaseDate ? new Date(data.releaseDate).toISOString() : null,
  duration: data.duration ? Number(data.duration) : null,
});

export default function Episode() {
  const [searchTerm, setSearchTerm] = useState("");
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedSeason, setSelectSeason] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [episodeId, setEpisodeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newEpisodeData, setNewEpisodeData] = useState(initialFormData);
  const [editEpisodeData, setEditEpisodeData] = useState(initialFormData);

  const handleSearchSeries = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return alert("Digite o nome da série");
    
    setLoading(true);
    try {
      const json = await searchSeries(searchTerm);
      setSeries(Array.isArray(json.data) ? json.data : []);
      setSelectedSerie(null);
      setEpisodes([]);
      setSelectedEpisode(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar séries");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadEpisodes = async (serieId) => {
    try {
      const json = await loadEpisodesBySerieId(serieId);
      setEpisodes(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar episódios da série");
    }
  };

  const handleSelectSerie = async (serie) => {
    setSelectedSerie(serie);
    setSelectedEpisode(null);
    setShowAddForm(false);
    setShowEditForm(false);
    await handleLoadEpisodes(serie.id);
  };

  const handleSelectEpisode = (episode) => {
    setSelectedEpisode(episode);
    setEpisodeId(episode.id);
    setShowAddForm(false);
    setShowEditForm(false);
  };

  const handleAddEpisode = async (event) => {
    event.preventDefault();
    if (!selectedSerie?.id) return alert("Selecione uma série primeiro");
    if (!newEpisodeData.title.trim()) return alert("Digite o título do episódio");
    
    try {
      setLoading(true);
      const payload = {
        ...parseEpisodeData(newEpisodeData),
        serieId: selectedSerie.id,
      };
      
      await createEpisode(payload);
      alert("Episódio criado com sucesso!");
      setNewEpisodeData(initialFormData);
      setShowAddForm(false);
      await handleLoadEpisodes(selectedSerie.id);
    } catch (err) {
      console.error(err);
      alert(`Erro ao criar episódio: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEpisode = async (event) => {
    event.preventDefault();
    if (!selectedEpisode?.id) return alert("Selecione um episódio primeiro");
    
    try {
      setLoading(true);
      const payload = parseEpisodeData(editEpisodeData);
      await updateEpisode(selectedEpisode.id, payload);
      alert("Episódio atualizado com sucesso!");
      setShowEditForm(false);
      setSelectedEpisode(null);
      await handleLoadEpisodes(selectedSerie.id);
    } catch (err) {
      console.error(err);
      alert(`Erro ao atualizar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEpisode = async () => {
    if (!selectedEpisode?.id) return alert("Selecione um episódio primeiro");
    if (!window.confirm(`Deseja deletar o episódio "${selectedEpisode.title}"?`)) return;
    
    try {
      setLoading(true);
      await deleteEpisode(selectedEpisode.id);
      alert("Episódio deletado com sucesso!");
      setSelectedEpisode(null);
      setShowEditForm(false);
      await handleLoadEpisodes(selectedSerie.id);
    } catch (err) {
      console.error(err);
      alert(`Erro ao deletar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openEditForm = () => {
    if (!selectedEpisode) return;
    setEditEpisodeData({
      title: selectedEpisode.title || "",
      description: selectedEpisode.description || "",
      episodeNumber: selectedEpisode.episodeNumber || "",
      seasonNumber: selectedEpisode.seasonNumber || "",
      releaseDate: selectedEpisode.releaseDate || "",
      duration: selectedEpisode.duration || "",
    });
    setShowEditForm(true);
  };

  const openUpload = () => {
    if(!selectedEpisode) return;
    setShowUpload(true)
  }

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!episodeId) return alert('Selecione um episódio');
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files[0];
    if (!file) return alert('Selecione um arquivo');
    
    try {
      setLoading(true);
      await uploadEpisodeVideo(selectedSerie.id,episodeId, file);
      alert('Vídeo enviado com sucesso!');
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
      setShowUpload(false);
    }
  };

  const handleUploadMetadata = async (e) => {
    e.preventDefault();
    if (!episodeId) return alert('Selecione um episódio');
    
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData);
    
    try {
      setLoading(true);
      await uploadEpisodeMetadata(episodeId, payload);
      alert('Metadados enviados com sucesso!');
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2>Gerenciar Episódios</h2>

      <form onSubmit={handleSearchSeries} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Buscar Série"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {series.length > 0 && (
        <div className={styles.episodesList}>
          <h4>Séries encontradas:</h4>

          {series.map((serie) => (
            <div
              key={serie.id}
              onClick={() => handleSelectSerie(serie)}
              className={`${styles.episodeItem} ${
                selectedSerie?.id === serie.id ? styles.episodeItemSelected : ""
              }`}
            >
              <strong>ID:</strong> {serie.id} <br />
              <strong>Título:</strong> {serie.title}
            </div>
          ))}
        </div>
      )}

      {selectedSerie && (
        <div className={styles.episodeDetails}>
          <h4>Série selecionada:</h4>
          <p><strong>ID:</strong> {selectedSerie.id}</p>
          <p><strong>Título:</strong> {selectedSerie.title}</p>
          <button onClick={() => setShowAddForm(true)} className={styles.addEpisodeButton} disabled={loading}>
            + Adicionar Novo Episódio
          </button>
        </div>
      )}

      {showAddForm && selectedSerie && (
        <Form
          onSubmit={handleAddEpisode}
          onCancel={() => setShowAddForm(false)}
          buttonLabel="Salvar Episódio"
          title={`Adicionar Novo Episódio - Série: ${selectedSerie.title}`}
          children={<EpisodeForm onChange={setNewEpisodeData} data={newEpisodeData}/>}
        />
      )}

      {selectedSerie && episodes.length > 0 && (
        <div className={styles.episodesList}>
          <h4>Episódios da série:</h4>
          {episodes.map((episode) => (
            <div key={episode.id}
              onClick={() => handleSelectEpisode(episode)}
              className={`${styles.episodeItem} ${
                selectedEpisode?.id === episode.id ? styles.episodeItemSelected : ""
              }`}
            >
              <strong>ID:</strong> {episode.id} <br />
              <strong>Título:</strong> {episode.title || "Sem título"} <br />
              <strong>Temporada:</strong> {episode.seasonNumber || "N/A"} <br />
              <strong>Número:</strong> {episode.episodeNumber || "N/A"}
            </div>
          ))}
        </div>
      )}

      {selectedSerie && episodes.length === 0 && (
        <p>Essa série ainda não possui episódios cadastrados.</p>
      )}

      {selectedEpisode && (
        <div className={styles.episodeDetails}>
          <h4>Episódio Selecionado:</h4>

          <p><strong>ID:</strong> {selectedEpisode.id}</p>
          <p><strong>Título:</strong> {selectedEpisode.title}</p>

          {selectedEpisode.description && (
            <p><strong>Descrição:</strong>{selectedEpisode.description}</p>
          )}

          {selectedEpisode.episodeNumber && (
            <p><strong>Número:</strong> {selectedEpisode.episodeNumber}</p>
          )}

          {selectedEpisode.duration && (
            <p><strong>Duração:</strong> {selectedEpisode.duration}</p>
          )}

          <p><strong>Episodio Upado URL:</strong> {selectedEpisode.url ? ("Episodio upado com sucesso") : ("episodio não upado")}</p>

          <button onClick={openEditForm} className={styles.episodeDetailsButton}>✏️ Editar Episódio</button>
          <button onClick={openUpload} className={styles.episodeDetailsButton}> Upload Video mp4</button>
          <button onClick={handleDeleteEpisode} className={styles.episodeDetailsButton}>🗑️ Deletar Episódio</button>
        </div>
      )}

      {showEditForm && selectedEpisode && (
        <Form
          onSubmit={handleEditEpisode}
          onCancel={() => setShowEditForm(false)}
          buttonLabel="Salvar Alterações"
          title={`Editar Episódio: ${selectedEpisode.title}`}
          children={<EpisodeForm data={editEpisodeData} onChange={setEditEpisodeData}/>}
        />
      )}
      {showUpload && selectedEpisode && (
        <section className={styles.uploadSection}>
        <h3>Configuração de Episódio</h3>
        <input type="text" placeholder="ID do Episódio" className={styles.formInput} value={episodeId} onChange={(e) => setEpisodeId(e.target.value)} />

        <h4>3. Upload Vídeo</h4>
        <form onSubmit={handleUploadVideo} className={styles.uploadForm}>
          <input type="file" name="file" accept="video/*" className={styles.uploadInput} required />
          <button type="submit" disabled={loading} className={styles.uploadButton}>
            {loading ? 'Enviando...' : 'Enviar Vídeo'}
          </button>
        </form>

        <h4>4. Upload Metadata</h4>
        <form onSubmit={handleUploadMetadata} className={styles.uploadForm}>
          <input name="title" placeholder="Título do Episódio" className={styles.formInput} required />
          <input name="description" placeholder="Descrição" className={styles.formInput} />
          <input name="duration" placeholder="Duração" className={styles.formInput} />
          <button type="submit" disabled={loading} className={styles.uploadButton}>
            {loading ? 'Enviando...' : 'Enviar Metadata JSON'}
          </button>
        </form>
      </section>
      )}

    </div>
  );
}