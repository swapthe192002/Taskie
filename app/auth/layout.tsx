import Image from "next/image";

const AuthLayout = ({ 
  children
}: { 
  children: React.ReactNode
}) => {
  return ( 
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-full w-full flex items-center justify-center bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]">
              <div className="w-full h-full flex">
                  <div className="bg-[#040d21] overflow-hidden w-[60%] lg:block hidden">
                      <div className="flex items-center justify-center overflow-hidden h-full">
                          <Image
                              src='/images/background.jpg'
                              alt="background"
                              layout="fill"
                              objectFit="cover"
                          />
                      </div>
                  </div>
                  <div className="bg-white dark:bg-[#09090B] overflow-hidden lg:w-[40%] z-10 flex items-center justify-center h-full w-full">
                      {children}
                  </div>
              </div>
            </div> 
          </div>
   );
}
 
export default AuthLayout;