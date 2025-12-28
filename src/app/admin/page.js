'use client'; // Necessário para usar hooks (useState) e browser APIs (fetch)

import menu from '@/components/menu';
import { useState } from 'react';

// CONFIGURE A URL DO SEU BACKEND AQUI
const API_URL = menu.Server_api; 

export default function AdminUploadPage() {
  // Estados para armazenar os IDs e Logs
  const [serieId, setSerieId] = useState('');
  const [episodeId, setEpisodeId] = useState('');
  const [logs, setLogs] = useState([]);

  // Função auxiliar para adicionar logs na tela
  const addLog = (msg) => setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // --- 1. SERVER STATUS ---
  const checkStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/server-status`, {
        method: 'GET',
        // 'credentials: include' garante que o Cookie (JWT) seja enviado 
        // se o backend estiver em outra porta/domínio.
        credentials: 'include', 
      });
      const data = await res.json();
      addLog(`Status: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Erro Status: ${error.message}`);
    }
  };

  // --- 2. UPLOAD SERIE IMAGE (Multer) ---
  const uploadSerieImage = async (e) => {
    e.preventDefault();
    
    // CORREÇÃO: Buscamos o input dentro do formulário (e.target)
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    if (!file || !serieId) return alert('Precisa de ID e Arquivo');

    const formData = new FormData();
    formData.append('SerieImage', file); // A chave deve bater com o multer do backend

    try {
      const res = await fetch(`${API_URL}/upload/serie-image/${serieId}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      addLog(`Upload Imagem Série: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Erro Imagem Série: ${error.message}`);
    }
  };

  // --- 3. UPLOAD EPISODE VIDEO (Multer) ---
  const uploadEpisodeVideo = async (e) => {
    e.preventDefault();
    
    // CORREÇÃO: Mesma lógica aqui
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput?.files[0];

    if (!file || !episodeId) return alert('Precisa de ID e Arquivo');

    const formData = new FormData();
    formData.append('EpisodeVideo', file); 

    try {
      const res = await fetch(`${API_URL}/upload/episode-video/${episodeId}`, {
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

  // --- 4. UPLOAD EPISODE METADATA (JSON) ---
  const uploadMetadata = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData); // Converte inputs em Objeto JSON

    if (!episodeId) return alert('Precisa do ID do episódio');

    try {
      const res = await fetch(`${API_URL}/upload/episode-metadata/${episodeId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json', // Aqui enviamos como JSON
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      addLog(`Upload Metadata: ${JSON.stringify(data)}`);
    } catch (error) {
      addLog(`Erro Metadata: ${error.message}`);
    }
  };

  return (
    <div style={{ fontFamily: 'monospace', padding: '20px' }}>
      <h1>Painel Admin (Raw Mode)</h1>
      <p>Certifique-se de que o Cookie JWT já está salvo no navegador.</p>
      
      <hr />

      {/* STATUS */}
      <section>
        <h3>1. Status do Servidor</h3>
        <button onClick={checkStatus}>Verificar Status</button>
      </section>

      <hr />

      {/* SERIE IMAGE */}
      <section>
        <h3>2. Upload Imagem da Série</h3>
        <input 
          type="text" 
          placeholder="ID da Série" 
          value={serieId} 
          onChange={(e) => setSerieId(e.target.value)} 
        />
        <br /><br />
        <form onSubmit={uploadSerieImage}>
          <input type="file" name="file" accept="image/*" />
          <button type="submit">Enviar Imagem</button>
        </form>
      </section>

      <hr />

      {/* SEÇÃO EPISÓDIO (Compartilha o ID para video e metadata) */}
      <section>
        <h3>Configuração de Episódio</h3>
        <input 
          type="text" 
          placeholder="ID do Episódio" 
          value={episodeId} 
          onChange={(e) => setEpisodeId(e.target.value)} 
        />

        {/* EPISODE VIDEO */}
        <h4>3. Upload Vídeo</h4>
        <form onSubmit={uploadEpisodeVideo}>
          <input type="file" name="file" accept="video/*" />
          <button type="submit">Enviar Vídeo</button>
        </form>

        {/* EPISODE METADATA */}
        <h4>4. Upload Metadata</h4>
        <form onSubmit={uploadMetadata}>
          <input name="title" placeholder="Título do Episódio" required /><br />
          <input name="description" placeholder="Descrição" /><br />
          <input name="duration" placeholder="Duração (ex: 24min)" /><br />
          <br />
          <button type="submit">Enviar Metadata (JSON)</button>
        </form>
      </section>

      <hr />

      {/* LOGS */}
      <section style={{ background: '#f0f0f0', padding: '10px', border: '1px solid #ccc' }}>
        <h3>Logs de Resposta:</h3>
        {logs.map((log, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ddd' }}>{log}</div>
        ))}
      </section>
    </div>
  );
}