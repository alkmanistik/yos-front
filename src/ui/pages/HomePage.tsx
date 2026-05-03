import {Link} from "react-router";
import {useAuth} from "../../contexts/AuthContext.tsx";

const HomePage = () => {

    const {user: currentUser} = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
            {/* Hero Section - адаптивный */}
            <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
                            Находи идеи для
                            <span className="text-blue-600"> покупок</span> и
                            <span className="text-purple-600"> подарков</span>
                        </h1>
                        <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
                            Социальная сеть, где ты можешь открыть для себя новые товары,
                            сохранять понравившиеся вещи и получать идеи подарков от друзей
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors">
                                <Link to={`/advice`}>Начать исследовать</Link>
                            </button>
                        </div>
                    </div>

                    {/* Hero Image Placeholder - адаптивный */}
                    <div className="mt-12 sm:mt-16 bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 max-w-4xl mx-auto">
                        <div className="aspect-video bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center p-4">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🛍️</div>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Здесь будет изображение с примером интерфейса - лента с товарами,
                                    вишлисты пользователей и рекомендации друзей
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section - адаптивный */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                            Как это работает?
                        </h2>
                        <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
                            Открой для себя новый способ шопинга вместе с друзьями
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Feature 1 */}
                        <div className="text-center p-4 sm:p-6 hover:bg-blue-50/50 rounded-xl transition-colors">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <span className="text-2xl sm:text-3xl">💡</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                Находи идеи
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                Просматривай ленту с товарами, которые рекомендуют другие пользователи.
                                Открывай для себя новые бренды и интересные вещи
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="text-center p-4 sm:p-6 hover:bg-purple-50/50 rounded-xl transition-colors">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <span className="text-2xl sm:text-3xl">🎁</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                Создавай вишлисты
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                Сохраняй понравившиеся товары в свои списки желаний.
                                Делитесь ими с друзьями, чтобы они знали, что вам подарить
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="text-center p-4 sm:p-6 hover:bg-green-50/50 rounded-xl transition-colors">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <span className="text-2xl sm:text-3xl">👥</span>
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                                Общайтесь с друзьями
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600">
                                Подписывайтесь на друзей, комментируйте их выбор и предлагайте
                                свои варианты подарков. Шопинг становится веселее вместе!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Section - адаптивный */}
            <section className="py-12 sm:py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                                Больше не ломай голову над подарками
                            </h2>
                            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
                                Тебе больше не придется гадать, что подарить друзьям на день рождения.
                                Просто зайди в их вишлист и выбери подарок, который они действительно хотят!
                            </p>
                            <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2 text-base sm:text-lg">✓</span>
                                    Видишь реальные желания друзей
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2 text-base sm:text-lg">✓</span>
                                    Не даришь ненужные вещи
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2 text-base sm:text-lg">✓</span>
                                    Получаешь именно то, что хочешь
                                </li>
                            </ul>
                        </div>

                        {/* Demo Image Placeholder - адаптивный */}
                        <div className="order-1 lg:order-2">
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">
                                <div className="aspect-square bg-gradient-to-br from-pink-50 to-orange-100 rounded-lg flex items-center justify-center p-4">
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">📱</div>
                                        <p className="text-sm sm:text-base text-gray-600">
                                            Здесь будет скриншот мобильного приложения с вишлистом -
                                            список товаров с фото, ценами и ссылками на покупку
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auth Section - адаптивный */}
            { !currentUser && (
                <section className="py-12 sm:py-20 bg-blue-600">
                    <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
                            Присоединяйся к сообществу
                        </h2>
                        <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                            Тысячи пользователей уже нашли идеальные подарки и открыли для себя
                            новые любимые бренды. Присоединяйся и ты!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors">
                                <Link to={`/auth/register`}>Зарегистрироваться</Link>
                            </button>
                            <button className="border-2 border-white text-white hover:bg-blue-700 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg transition-colors">
                                <Link to={`/auth/login`}>Войти</Link>
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;