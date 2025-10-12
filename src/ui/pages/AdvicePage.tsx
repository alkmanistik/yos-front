import { useState, useEffect } from 'react';
import AdviceShortComponent from '../components/AdviceShortComponent';
import type {AdviceShortResponse} from "../../types/advice.ts";
import type {ImageShortResponse} from "../../types/image.ts";
import type {PaginationParams} from "../../types/pagination.ts";
import {adviceApi} from "../../api/adviceApi.ts";
import {useNavigate} from "react-router";

const AdvicePage = () => {
    const [advices, setAdvices] = useState<AdviceShortResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchQueryCurrent, setSearchQueryCurrent] = useState('');
    const [sponsoredAdvices, setSponsoredAdvices] = useState<AdviceShortResponse[]>([]);
    const [adImages, setAdImages] = useState<ImageShortResponse[]>([]);
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        loadAdvices();
        loadSponsoredAdvices();
        loadAdImages();
    }, []);

    const loadAdvices = async (query?: string) => {
        try {
            setLoading(true);
            const params: PaginationParams = {
                page: 0,
                size: 20,
                sort: 'DESC'
            };

            const response = query
                ? await adviceApi.searchAdvices(query, params)
                : await adviceApi.searchAdvices(undefined, params);
            setSearchQueryCurrent(searchQuery)
            setAdvices(response);
        } catch (error) {
            console.error('Error loading advices:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSponsoredAdvices = async () => {
        try {
            // todo("Сделать api для рекламы")
            const params: PaginationParams = {
                page: 0,
                size: 5,
                sort: 'DESC'
            };
            const response = await adviceApi.searchAdvices(undefined, params);
            const sponsored = response.filter(advice => advice.adAdvice).slice(0, 3);
            setSponsoredAdvices(sponsored);
        } catch (error) {
            console.error('Error loading sponsored advices:', error);
        }
    };

    const loadAdImages = async () => {
        try {
            // todo("Сделать api для рекламы")
            const mockAdImages: ImageShortResponse[] = [
                { id: '1', fileName: 'ad1.jpg', main: true, createdAt: new Date().toISOString() },
                { id: '2', fileName: 'ad2.jpg', main: true, createdAt: new Date().toISOString() },
                { id: '3', fileName: 'ad3.jpg', main: true, createdAt: new Date().toISOString() },
            ];
            setAdImages(mockAdImages);
        } catch (error) {
            console.error('Error loading ad images:', error);
        }
    };

    useEffect(() => {
        if (adImages.length > 1) {
            const interval = setInterval(() => {
                setCurrentAdIndex((prev) => (prev + 1) % adImages.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [adImages.length]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        loadAdvices(searchQuery);
    };

    const nextAd = () => {
        setCurrentAdIndex((prev) => (prev + 1) % adImages.length);
    };

    const prevAd = () => {
        setCurrentAdIndex((prev) => (prev - 1 + adImages.length) % adImages.length);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Спонсорские советы */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h2 className="text-2xl font-bold text-gray-900">Идеи от партнеров</h2>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {sponsoredAdvices.map((advice) => (
                            <div key={advice.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                                <div className="flex items-center mb-3">
                                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded mr-2">
                                        Партнер
                                    </span>
                                    <span className="text-sm text-gray-500">Рекомендует</span>
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                    {advice.title}
                                </h3>
                                {advice.category && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                                        {advice.category}
                                    </span>
                                )}
                                <div className="text-sm text-gray-600">
                                    Узнайте больше у нашего партнера
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Карусель рекламы */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="relative h-64 bg-gradient-to-r from-orange-400 to-pink-500">
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">🎯</div>
                                    <h3 className="text-2xl font-bold mb-2">Специальное предложение!</h3>
                                    <p className="text-lg opacity-90">
                                        Здесь будет рекламный баннер с призывом к действию
                                    </p>
                                    <button className="mt-4 bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                        Узнать больше
                                    </button>
                                </div>
                            </div>

                            {adImages.length > 1 && (
                                <>
                                    <button
                                        onClick={prevAd}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={nextAd}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white rounded-full p-2 hover:bg-black/50 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {adImages.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentAdIndex(index)}
                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                    index === currentAdIndex ? 'bg-white' : 'bg-white/50'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Поиск и список советов */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Поиск */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex-1 max-w-3xl">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Поиск советов по категориям, темам..."
                                className="w-full p-4 pl-12 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Найти
                            </button>
                        </form>
                    </div>

                    {/* Кнопка Новый совет */}
                    <button
                        onClick={() => navigate('/advice/create')}
                        className="ml-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 whitespace-nowrap"
                    >
                        <span className="text-lg font-bold">+</span>
                        <span>Новый совет</span>
                    </button>
                </div>



                {/* Заголовок */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {searchQueryCurrent ? `Результаты поиска: "${searchQueryCurrent}"` : 'Последние советы'}
                    </h2>
                    <span className="text-gray-500">
                        {advices.length} советов
                    </span>
                </div>

                {/* Список советов */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : advices.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">💡</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {searchQuery ? 'Советы не найдены' : 'Советов пока нет'}
                        </h3>
                        <p className="text-gray-500">
                            {searchQuery
                                ? 'Попробуйте изменить поисковый запрос'
                                : 'Будьте первым, кто поделится полезным советом'
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {advices.map(advice => (
                            <AdviceShortComponent
                                key={advice.id}
                                advice={advice}
                                showUser={true}
                                onClick={(id) => navigate("/advice/" + id)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdvicePage;