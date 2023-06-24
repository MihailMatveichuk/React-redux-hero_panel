import { v4 as uuidv4 } from "uuid";
import { heroesCreate } from "../heroesList/heroesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useHttp } from "../../hooks/http.hook";
import { useForm } from "react-hook-form";
import { selectAll } from "../heroesFilters/filtersSlice";
import store from "../../store";

const HeroesAddForm = () => {
  const { filtersLoadingStatus } = useSelector((state) => state.filters);

  const filters = selectAll(store.getState());
  const dispatch = useDispatch();
  const { request } = useHttp();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = ({ name, description, element }) => {
    const newCharacter = {
      id: uuidv4(),
      name,
      description,
      element,
    };

    request(
      "http://localhost:3001/heroes",
      "POST",
      JSON.stringify(newCharacter)
    )
      .then((res) => console.log("Отправка успешна"))
      .then(dispatch(heroesCreate(newCharacter)))
      .catch((err) => console.log(err));

    reset();
  };

  const renderFilters = (filters, status) => {
    if (status === "loading") {
      return <option>Загрузка элементов</option>;
    } else if (status === "error") {
      return <option>Ошибка загрузки</option>;
    }

    if (filters && filters.length > 0) {
      return filters.map(({ name, label }) => {
        if (name === "all") return;

        return (
          <option key={name} value={name}>
            {label}
          </option>
        );
      });
    }
  };

  return (
    <form
      className='border p-4 shadow-lg rounded'
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='mb-3'>
        <label htmlFor='name' className='form-label fs-4'>
          Имя нового героя
        </label>
        <input
          {...register("name")}
          required
          type='text'
          name='name'
          className='form-control'
          id='name'
          placeholder='Как меня зовут?'
        />
      </div>

      <div className='mb-3'>
        <label htmlFor='text' className='form-label fs-4'>
          Описание
        </label>
        <textarea
          {...register("description")}
          required
          name='description'
          className='form-control'
          id='text'
          placeholder='Что я умею?'
          style={{ height: "130px" }}
        />
      </div>

      <div className='mb-3'>
        <label htmlFor='element' className='form-label'>
          Выбрать элемент героя
        </label>
        <select
          {...register("element")}
          required
          className='form-select'
          id='element'
          name='element'
        >
          <option>Я владею элементом...</option>
          {renderFilters(filters, filtersLoadingStatus)}
        </select>
      </div>

      <button type='submit' className='btn btn-primary'>
        Создать
      </button>
    </form>
  );
};

export default HeroesAddForm;
