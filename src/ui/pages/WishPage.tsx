import {useNavigate} from "react-router";
import {useAuth} from "../../contexts/AuthContext.tsx";
import {useEffect, useState} from "react";
import type {WishShortResponse} from "../../types/wish.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import {wishApi} from "../../api/wishApi.ts";
import WishShortComponent from "../components/WishShortComponent.tsx";
import {useToast} from "../../hooks/useToast.tsx";

const WishPage = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [wishes, setWishes] = useState<WishShortResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryCurrent, setSearchQueryCurrent] = useState('');
    const { showToast, ToastContainer } = useToast();

    useEffect(() => {
        loadWishes();
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

            setSearchQueryCurrent(query || '');
            setWishes(response);
        } catch (error) {
            console.error('Error loading wishes:', error);
            showToast('Не удалось загрузить желания', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadWishes(searchQuery);
    };

    const handleWishClick = (wishId: string) => {
        navigate(`/wish/${wishId}`);
    };

    const handleReserveStatusChange = async () => {
        // Просто обновляем список без перезагрузки страницы
        await loadWishes(searchQueryCurrent);
    };

    return (
        <>
            <ToastContainer />
            <div className="min-h-screen bg-gray-50">
                {/* Призыв */}
                <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
                            Не забудь сделать близким приятное 🎁
                        </h1>
                        <p className="text-base sm:text-xl text-purple-100 mb-4 sm:mb-6 px-2">
                            Узнай, о чем мечтают твои друзья, и подари им именно то, что они хотят
                        </p>
                        <button
                            onClick={() => navigate('/wish/create')}
                            className="bg-white text-purple-600 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors inline-flex items-center space-x-2"
                        >
                            <span>+</span>
                            <span>Создать своё желание</span>
                        </button>
                    </div>
                </section>

                {/* Все желания */}
                <section className="py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Поиск и кнопка создания */}
                        <div className="mb-6 sm:mb-8">
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <div className="flex-1 w-full">
                                    <form onSubmit={handleSearch} className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Поиск желаний..."
                                            className="w-full p-3 sm:p-4 pl-10 sm:pl-12 pr-20 sm:pr-24 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-base sm:text-lg"
                                        />
                                        <div className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <button
                                            type="submit"
                                            className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm sm:text-base"
                                        >
                                            Найти
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>

                        {/* Заголовок */}
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {searchQueryCurrent ? `Результаты поиска: "${searchQueryCurrent}"` : 'Все желания друзей'}
                            </h2>
                            <span className="text-sm sm:text-base text-gray-500">
                                {wishes.length} желаний
                            </span>
                        </div>

                        {/* Список желаний */}
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-purple-600"></div>
                            </div>
                        ) : wishes.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <span className="text-xl sm:text-2xl">🎁</span>
                                </div>
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                                    {searchQueryCurrent ? 'Желания не найдены' : 'Желаний пока нет'}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-500 px-4">
                                    {searchQueryCurrent
                                        ? 'Попробуйте изменить поисковый запрос'
                                        : 'Будьте первым, кто создаст желание'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {wishes.map(wish => (
                                    <WishShortComponent
                                        key={wish.id}
                                        wish={wish}
                                        showUser={true}
                                        onClick={handleWishClick}
                                        isOwn={currentUser?.id === wish.userId}
                                        onReserveStatusChange={handleReserveStatusChange}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
};

export default WishPage;