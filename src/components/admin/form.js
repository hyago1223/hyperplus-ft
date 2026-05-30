const Form = ({ onSubmit, onCancel, buttonLabel, title, children }) => {
  const isAdd = title.includes('Adicionar');
  return (
    <div className={`${styles.formContainer} ${isAdd ? styles.formContainerAdd : styles.formContainerEdit}`}>
      <h4>{title}</h4>
      <form onSubmit={onSubmit}>
        {children}
        <div className={styles.formButtons}>
          <button type='submit' className={`${styles.formButton} ${isAdd ? styles.formButtonSubmit : styles.formButtonSubmitEdit}`}>
            {buttonLabel}
          </button>
          <button type='button' onClick={onCancel} className={`${styles.formButton} ${styles.formButtonCancel}`}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export const UserInput = ({ data, onChange }) => {
  return(
    <>
      <input type='text' placeholder='nome do usuario' className={styles.formInput} value={data.name} onChange={(e) => onChange({...data, name: e.target.value})}/>
    </>
  );
}

export const SerieInputs = ({ onChange, data }) =>{
  return (
    <>
      <input type='text' placeholder='Titulo da Serie' className={styles.formInput} value={data.title} onChange={(e) => onChange({...data, title: e.target.value})}/>
      <textarea placeholder='Descricao' className={styles.formTextarea} value={data.description} onChange={(e) => onChange({...data, description: e.target.value})}/>
      <input type='text' placeholder='Classificacao' className={styles.formInput} value={data.classification} onChange={(e) => onChange({...data, classification: e.target.value})}/>
      <select className={styles.formInput} >
      </select>
    </>
  );
}

export const EpisodeForm = ({onChange, data}) => {
  return (
    <>
      <input type='text' placeholder='Título do Episódio' className={styles.formInput} value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} required />
      <input type='text' placeholder='Número do Episódio' className={styles.formInput} value={data.episodeNumber} onChange={(e) => onChange({ ...data, episodeNumber: e.target.value })}/>
      <input type='text' placeholder='Temporada do Episoio' className={styles.formInput} value={data.seasonNumber} onChange={(e) => onChange({...data, seasonNumber: e.target.value})}/>
      <textarea placeholder='Descrição' className={styles.formTextarea} value={data.description} onChange={(e) => onChange({ ...data, description: e.target.value })} rows='3' />
      <input type='text' placeholder='Duração (ex: 24min)' className={styles.formInput} value={data.duration} onChange={(e) => onChange({ ...data, duration: e.target.value })} />
      <input type='date' placeholder='Data de Lançamento' className={styles.formInput} value={data.releaseDate} onChange={(e) => onChange({ ...data, releaseDate: e.target.value})}/>
    </>
  );
}