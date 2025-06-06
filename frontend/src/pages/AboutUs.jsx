import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAs2MdUM7maedtOAVnOUQ3siCojp1Zt8T7D6bU0Kfe-FfvpcAfLTSAcRwhO6QIHG9zIcg8ySg38Bw_yDJJNxUTDRVeITWeC39Ush1sdVbzj2xZai9TCmqBPFtgIgDiqWZRGItjpMqWW2X5MnfTEQDTWY9wYa-w9g2znOD0OW6P_K20W5iHUK-N-Kz2mVJI4fb6HoiaSDJvdPVEr_2n2rd-XZMaGsa9-ORdg8Dk4fUuNeWU-RWETsr3yt8cMhC4BT8leYb6IsAXOGSA',
  },
  {
    name: 'David Lee',
    role: 'CTO',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz7097ItesFEtg4hgs89urKsCJ1nnclf3JTC0oAQqBOsQBj2pn9w6NwySZisH7vlNSFXvbDqy0JvIqRFffa9CAOFmRfG2AVG6aCJU92xCjmzLTrx4JISqcmAM1q0LW57IJYK91KUaSEyr2O7q0e1GTasK8LSnFymB3Lu8GxTDYP0hWHhcmF-nb0cdRpFACkKgvPC_5c1tj5jnIQ7ArzpJ8VClIUdJxfuyHUD5RBj8hwpcN6CMIw05DWnqgeaS0hrZq4IoI1FDNrPQ',
  },
  {
    name: 'Maria Rodriguez',
    role: 'Head of Security',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXYBi5npl1dqhXV2JCF_qrCGAAPgjpk8DUGGKxByMevFWI4SuVvN6YWGpWJrb3G47G4NVp6PkY7uVSeiTkMJnfECtP5sYCamNz956340R6U8aSNODOBnfK3RyN5jiljkFipWh6UPfWk4SlveuDYMYWFcOgKe2T4M_rbVOI19Nyu_OxpLeK9pPaiveoHzGYH3rfvsgLaHOT-xPDvjWLXaQuwy3cPnIC6KmanbOWYRCe_1PSR6CST2fvyOGhriE74rc89Q9Uap7uAMU',
  },
  {
    name: 'Alex Johnson',
    role: 'Head of Product',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBywVWLslUxqD7DbPwdjI9vq-kYVB0rFuByGF6BnaWzqK2Gg8ACOuK3bl3PxSK52dTD88q-fW5TRif_TtQgAp3AjIrpetVKwSCqFQ8jGPH2qaW6WNygvzm6dIv4SmX56L6ohu1I-divprsqTfzCnDkUX4mwyo7A3l7z52XU-z7CCarrqsf1jOv3zxCEVzHZLgSemGWy2-g67M-LxjfJja07u521pj7Q7sJuNShjiFAWu5ubOjJDXoEyEPdfUrP4ZPPcKSldcVUNAtY',
  },
];

const AboutUs = () => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative flex size-full min-h-screen flex-col bg-gray-50 dark:bg-gray-900 group/design-root overflow-x-hidden ${isDarkMode ? 'dark' : ''}`}
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 sm:px-8 md:px-16 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container mt-16 flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight">About Us</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal">Learn more about our mission, history, and the team behind Votely.</p>
              </div>
            </div>
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our Mission</h2>
            <p className="text-gray-900 dark:text-gray-200 text-base font-normal leading-normal pb-3 pt-1 px-4">
              At Votely, our mission is to empower individuals and organizations with a secure, accessible, and transparent online voting platform. We believe that every vote
              should be counted accurately and fairly, and we are committed to providing a solution that ensures the integrity of the voting process.
            </p>
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our History</h2>
            <p className="text-gray-900 dark:text-gray-200 text-base font-normal leading-normal pb-3 pt-1 px-4">
              Founded in 2020, Votely was created in response to the growing need for secure and reliable online voting solutions. Our team of experts in cybersecurity, software
              development, and election management came together to build a platform that addresses the challenges of traditional voting methods while leveraging the benefits of
              technology.
            </p>
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Our Team</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
              {team.map((member) => (
                <div key={member.name} className="flex flex-col gap-3 text-center pb-3">
                  <div className="px-4">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-full border-4 border-gray-200 dark:border-gray-700"
                      style={{ backgroundImage: `url('${member.img}')` }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">{member.name}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-normal leading-normal">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
            <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Contact Us</h2>
            <p className="text-gray-900 dark:text-gray-200 text-base font-normal leading-normal pb-3 pt-1 px-4">
              If you have any questions or would like to learn more about Votely, please don't hesitate to contact us. We're here to help you make your voting process secure and
              efficient.
            </p>
            <div className="flex px-4 py-3 justify-start">
              <Link to="/contact">
                <button
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  <span className="truncate">Contact Us</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 