<?php

namespace App\Controller;

use App\Entity\Img;
use App\Entity\Mark;
use App\Helper\FileHelper;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ImgController extends AbstractController
{
    use FileHelper;
    /**
     * @Route("/img/{id}", name="img")
     * @param $id
     * @return BinaryFileResponse
     */
    public function index($id)
    {
        $img = $this->getDoctrine()->getRepository(Img::class)->find($id);
        return $this->file($img->getPath());
    }

    /**
     * @param Request $request
     * @Route("/admin/api/mark/img", name="admin_api_mark_img", methods={"POST"})
     * @return JsonResponse
     * @throws Exception
     */
    public function uploadImageForMark(Request $request){
        /** @var UploadedFile $file */
        $file = $request->files->get('file');
        $name = $request->get('name');
        $em = $this->getDoctrine()->getManager();
        $fileName = $this->generateFileName().'.'.$file->getClientOriginalExtension();

        $img = new Img();
        $mark = new Mark();

        $path = $this->getParameter('storage');
        $this->moveFile($file, $path, $fileName);

        $mark->setName($name);
        $img->setName($file->getClientOriginalName());
        $img->setPath($path. '/' . $fileName);
        $em->persist($img);
        $mark->setImg($img);
        $em->persist($mark);
        $em->flush();

        return $this->json(['success' => 'La marque à bien été ajoutée']);
    }
}
