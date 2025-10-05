const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-lg font-bold mb-4">Alkmanistik's Corp</h3>
                        <p className="text-gray-300 mb-4">
                            Компания интузиастов для интузиастов
                        </p>
                        <div className="flex space-x-4">
                            <a href="http://alkmanistik.github.io" className="text-gray-300 hover:text-white">Личный сайт</a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Решения</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-white">Коммерция</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white">Маркетинг</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white">Анализ</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Поддержка</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-300 hover:text-white">Документация</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white">Обращения</a></li>
                            <li><a href="#" className="text-gray-300 hover:text-white">Цены</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-300 text-sm">
                        © {currentYear} Alkmanistik's Corp. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-300 hover:text-white text-sm">Privacy</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm">Terms</a>
                        <a href="#" className="text-gray-300 hover:text-white text-sm">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;