import { useState } from "react";
import { envs as env } from "@/lib/env";
import { Form, EpisodeForm } from '../form.js'
const API_URL = env.serverApi;

const initialFormData = {
  title: "",
  description: "",
  episodeNumber: "",
  seasonNumber: "",
  duration: "",
  releaseDate: "",
};

export default function Episode() {
  const [searchTerm, setSearchTerm] = useState("");
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [selectedSeason, setSelectSeason] = useState(null);
  const [episodeId, setEpisodeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newEpisodeData, setNewEpisodeData] = useState(initialFormData);
  const [editEpisodeData, setEditEpisodeData] = useState(initialFormData);

    const uploadEpisodeVideo = async (e) => {
    e.preventDefault();
    
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    if (!file || !episodeId) return alert('Precisa de ID e Arquivo');

    const formData = new FormData();
    formData.append('EpisodeVideo', file); 

    try {
      const res = await fetch(`${API_URL}/admin/upload/episode-video/${episodeId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      addLog(`Upload Vídeo Episódio: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Erro Vídeo Episódio: ${error.message}`);
    }
  };

  const uploadMetadata = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData); 

    if (!episodeId) return alert('Precisa do ID do episódio');

    try {
      const res = await fetch(`${API_URL}/admin/upload/episode-metadata/${episodeId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      addLog(`Upload Metadata: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Erro Metadata: ${error.message}`);
    }
  };

    
    async function requestJson(url, options = {}) {
    const response = await fetch(url, {
      credentials: "include",
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
      },
    });
    const text = await response.text();
    let json;
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      console.error("Resposta não JSON:", text);
      throw new Error("O servidor não retornou JSON");
    }

    if (!response.ok) {
      throw new Error(json.message || `Erro HTTP ${response.status}`);
    }

    return json;
  }

  async function searchSeries(event) {
    event.preventDefault();

    if (!searchTerm.trim()) {
      return alert("Digite o nome da série");
    }

    setLoading(true);

    try {
      const json = await requestJson(
        `${API_URL}/search?query=${encodeURIComponent(searchTerm)}`
      );

      console.log("Séries encontradas:", json);

      setSeries(Array.isArray(json.data) ? json.data : []);
      setSelectedSerie(null);
      setEpisodes([]);
      setSelectedEpisode(null);
      setSelectSeason(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar séries");
    } finally {
      setLoading(false);
    }
  }

  async function loadEpisodesBySerieId(serieId) {
    try {
      const json = await requestJson(
        `${API_URL}/admin/serie/${serieId}/episodes-metadata`
      );

      console.log("Episódios da série:", json);

      setEpisodes(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar episódios da série");
    }
  }

  async function handleSelectSerie(serie) {
    setSelectedSerie(serie);
    setSelectedEpisode(null);
    setShowAddForm(false);
    setShowEditForm(false);

    await loadEpisodesBySerieId(serie.id);
  }

  function handleSelectEpisode(episode) {
    setSelectedEpisode(episode);
    setEpisodeId(episode.id);
    setShowAddForm(false);
    setShowEditForm(false);
  }

  async function handleAddEpisode(event) {
    event.preventDefault();

    if (!selectedSerie?.id) {
      return alert("Selecione uma série primeiro");
    }

    if (!newEpisodeData.title.trim()) {
      return alert("Digite o título do episódio");
    }

    try {
      const payload = {
        ...newEpisodeData,
        serieId: selectedSerie.id,
        episodeNumber: newEpisodeData.episodeNumber ? Number(newEpisodeData.episodeNumber) : null,
        seasonNumber: newEpisodeData.seasonNumber ? Number(newEpisodeData.seasonNumber) : null,
        releaseDate: newEpisodeData.releaseDate ? Date(newEpisodeData.releaseDate) : null,
        duration: newEpisodeData.duration ? Number(newEpisodeData.duration) : null,
      };

      const json = await requestJson(`${API_URL}/admin/episode`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (json.success) {
        alert("Episódio criado com sucesso!");
        setNewEpisodeData(initialFormData);
        setShowAddForm(false);
        await loadEpisodesBySerieId(selectedSerie.id);
      } else {
        alert(json.message || "Erro ao criar episódio");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao criar episódio");
    }
  }

  async function handleEditEpisode(event) {
    event.preventDefault();

    if (!selectedEpisode?.id) {
      return alert("Selecione um episódio primeiro");
    }

    try {
      const payload = {
        ...editEpisodeData,
        episodeNumber: editEpisodeData.episodeNumber ? Number(editEpisodeData.episodeNumber) : null,
        seasonNumber: newEpisodeData.seasonNumber ? Number(newEpisodeData.seasonNumber) : null,
        releaseDate: newEpisodeData.releaseDate ? Date(newEpisodeData.releaseDate) : null,
        duration: editEpisodeData.duration? Number(editEpisodeData.duration) : null,
      };

      const json = await requestJson(
        `${API_URL}/admin/episode/${selectedEpisode.id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (json.success) {
        alert("Episódio atualizado com sucesso!");

        setShowEditForm(false);
        setSelectedEpisode(null);
        setSelectSeason(null);

        await loadEpisodesBySerieId(selectedSerie.id);
      } else {
        alert(json.message || "Erro ao atualizar episódio");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar episódio");
    }
  }

  async function handleDeleteEpisode() {
    if (!selectedEpisode?.id) {
      return alert("Selecione um episódio primeiro");
    }

    const confirmDelete = confirm(
      `Deseja deletar o episódio "${selectedEpisode.title}"?`
    );

    if (!confirmDelete) return;

    try {
      const json = await requestJson(
        `${API_URL}/admin/episode/${selectedEpisode.id}`,
        {
          method: "DELETE",
        }
      );

      if (json.success) {
        alert("Episódio deletado com sucesso!");

        setSelectedEpisode(null);
        setShowEditForm(false);

        await loadEpisodesBySerieId(selectedSerie.id);
      } else {
        alert(json.message || "Erro ao deletar episódio");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar episódio");
    }
  }

  function openEditForm() {
    if (!selectedEpisode) return;

    setEditEpisodeData({
      title: selectedEpisode.title || "",
      description: selectedEpisode.description || "",
      episodeNumber: selectedEpisode.episodeNumber || "",
      seasonNumber: selectedSeason.seasonNumber || "",
      releaseDate: selectedEpisode.releaseDate || "",
      duration: selectedEpisode.duration || "",
    });

    setShowEditForm(true);
  }

  return (
    <div style={{ padding: "10px" }}>
      <h2>Gerenciar Episódios</h2>

      <form onSubmit={searchSeries} className={styles.searchForm}>
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
          <button onClick={() => setShowAddForm(true)} className={styles.addEpisodeButton}>
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
              <strong>Temporada: </strong> {episode.seasonNumber || " N/A"} <br />
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

          <p><strong>Episodio Upado URL:</strong> {selectedEpisode.url ? (<p>Episodio upado com sucesso</p>) : (<p>episodio não upado</p>)}</p>

          <button onClick={openEditForm} className={styles.episodeDetailsButton}>✏️ Editar Episódio</button>
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

      <section className={styles.uploadSection}>
        <h3>Configuração de Episódio</h3>
        <input type="text" placeholder="ID do Episódio" className={styles.formInput} value={episodeId}onChange={(e) => setEpisodeId(e.target.value)}/>

        <h4>3. Upload Vídeo</h4>
        <form onSubmit={uploadEpisodeVideo} className={styles.uploadForm}>

          <input type="file" name="file" accept="video/*" className={styles.uploadInput}/>

          <button type="submit" className={styles.uploadButton}>Enviar Vídeo</button>
        </form>

        <h4>4. Upload Metadata</h4>
        <form onSubmit={uploadMetadata} className={styles.uploadForm}>

          <input name="title" placeholder="Título do Episódio" className={styles.formInput} required />
          <input name="description" placeholder="Descrição" className={styles.formInput} />
          <input name="duration" placeholder="Duração" className={styles.formInput}/>

          <button type="submit" className={styles.uploadButton}>Enviar Metadata JSON</button>
        </form>
      </section>
    </div>
  );
}