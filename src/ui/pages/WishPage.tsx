import {useNavigate} from "react-router";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import type {WishShortResponse} from "../../types/wish.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import {wishApi} from "../../api/wishApi.ts";
import WishShortComponent from "../components/WishShortComponent.tsx";

const WishPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [wishes, setWishes] = useState<WishShortResponse[]>([]);
    const [friendsWishes, setFriendsWishes] = useState<WishShortResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadWishes();
        loadFriendsWishes();
    }, []);

    const loadWishes = async (query?: string) => {
        try {
            setLoading(true);
            const params: PaginationParams = {
                page: 0,
                size: 20,
                sort: 'DESC'
            };

            const response = query
                ? await wishApi.searchWishes(query, params)
                : await wishApi.searchWishes(undefined, params);

            setWishes(response);
        } catch (error) {
            console.error('Error loading wishes:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadFriendsWishes = async () => {
        try {
            setLoadingFriends(true);
            // Здесь должен быть API для желаний друзей
            // Пока используем mock или общий поиск
            const params: PaginationParams = {
                page: 0,
                size: 6,
                sort: 'DESC'
            };
            const response = await wishApi.searchWishes(undefined, params);
            setFriendsWishes(response.slice(0, 6)); // Берем первые 6 для примера
        } catch (error) {
            console.error('Error loading friends wishes:', error);
        } finally {
            setLoadingFriends(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadWishes(searchQuery);
    };

    const handleWishClick = (wishId: string) => {
        navigate(`/wish/${wishId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Призыв */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Не забудь сделать близким приятное 🎁
                    </h1>
                    <p className="text-xl text-purple-100 mb-6">
                        Узнай, о чем мечтают твои друзья, и подари им именно то, что они хотят
                    </p>
                    <button
                        onClick={() => navigate('/wish/create')}
                        className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-flex items-center space-x-2"
                    >
                        <span>+</span>
                        <span>Создать свое желание</span>
                    </button>
                </div>
            </section>

            {/* Желания друзей */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Желания друзей
                        </h2>
                        <span className="text-gray-500">
                            {friendsWishes.length} желаний
                        </span>
                    </div>

                    {loadingFriends ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : friendsWishes.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👥</span>
                            </div>
                            <p className="text-gray-500">
                                У ваших друзей пока нет публичных желаний
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {friendsWishes.map(wish => (
                                <WishShortComponent
                                    key={wish.id}
                                    wish={wish}
                                    showUser={true}
                                    onClick={handleWishClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Все желания */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Поиск и кнопка создания */}
                    <div className="mb-8">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <div className="flex-1 max-w-2xl w-full">
                                <form onSubmit={handleSearch} className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Поиск желаний..."
                                        className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
                                    />
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                    >
                                        Найти
                                    </button>
                                </form>
                            </div>

                            <button
                                onClick={() => navigate('/wish/create')}
                                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg flex items-center space-x-2 whitespace-nowrap w-full sm:w-auto justify-center"
                            >
                                <span className="text-lg font-bold">+</span>
                                <span>Новое желание</span>
                            </button>
                        </div>
                    </div>

                    {/* Заголовок */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {searchQuery ? `Результаты поиска: "${searchQuery}"` : 'Все желания'}
                        </h2>
                        <span className="text-gray-500">
                            {wishes.length} желаний
                        </span>
                    </div>

                    {/* Список желаний */}
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                        </div>
                    ) : wishes.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🎁</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? 'Желания не найдены' : 'Желаний пока нет'}
                            </h3>
                            <p className="text-gray-500">
                                {searchQuery
                                    ? 'Попробуйте изменить поисковый запрос'
                                    : 'Будьте первым, кто создаст желание'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishes.map(wish => (
                                <WishShortComponent
                                    key={wish.id}
                                    wish={wish}
                                    showUser={true}
                                    onClick={handleWishClick}
                                    isOwn={currentUser?.id === wish.userId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default WishPage;